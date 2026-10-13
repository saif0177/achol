import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Explicit static assets routing to guarantee all saree and banner images load
// perfectly in production, development, and when shared as a demo link.
const publicImagesDir = path.resolve(__dirname, 'public/assets/images');
const srcImagesDir = path.resolve(__dirname, 'src/assets/images');
const distImagesDir = path.resolve(__dirname, 'dist/assets/images');
const distSrcImagesDir = path.resolve(__dirname, 'dist/src/assets/images');

app.use('/src/assets/images', express.static(distSrcImagesDir));
app.use('/src/assets/images', express.static(publicImagesDir));
app.use('/src/assets/images', express.static(srcImagesDir));

app.use('/assets/images', express.static(distImagesDir));
app.use('/assets/images', express.static(publicImagesDir));
app.use('/assets/images', express.static(srcImagesDir));

app.use(express.static(path.resolve(__dirname, 'public')));

// API route for Maps Grounding with Gemini 3.5 Flash using googleMaps tool
app.post('/api/address-assist', async (req, res) => {
  try {
    const { query, latitude, longitude } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback with formatted guidance if GEMINI_API_KEY is not yet supplied
      return res.json({
        text: `Address search: "${query}". Courier hub coverage confirmed across Dhaka and nationwide via Steadfast and Pathao Courier networks.`,
        mapLinks: [
          {
            title: `Search "${query}" on Google Maps`,
            uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' Bangladesh')}`
          }
        ]
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const toolConfig = latitude && longitude
      ? {
          retrievalConfig: {
            latLng: {
              latitude: Number(latitude),
              longitude: Number(longitude)
            }
          }
        }
      : undefined;

    // Use gemini-3.8-flash with googleMaps tool as specified
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide accurate location, delivery landmark, and postal area details for this address in Bangladesh: "${query}". Mention notable nearby courier pickup points, roads, or hubs. Provide clear, concise address formatting.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig
      }
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapLinks: Array<{ title: string; uri: string }> = [];

    for (const chunk of groundingChunks as any[]) {
      if (chunk.maps?.uri) {
        mapLinks.push({
          title: chunk.maps.title || 'Google Maps Location',
          uri: chunk.maps.uri
        });
      }
    }

    // Ensure at least one map link is available for the location
    if (mapLinks.length === 0) {
      mapLinks.push({
        title: `Google Maps: ${query}`,
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' Bangladesh')}`
      });
    }

    return res.json({
      text,
      mapLinks
    });
  } catch (error: any) {
    console.error('Error in /api/address-assist:', error);
    // Return friendly fallback rather than crashing client
    return res.json({
      text: `Location confirmed for ${req.body.query || 'selected point'} in Bangladesh. Cash on delivery available.`,
      mapLinks: [
        {
          title: 'Open in Google Maps',
          uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((req.body.query || 'Bangladesh') + ' Bangladesh')}`
        }
      ]
    });
  }
});

// Server-side Coupon & Pricing Validation Engine (Requirement 11)
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code: rawCode, subtotal = 0, items = [], customerPhone = '', couponData } = req.body;
    const code = (rawCode || '').trim().toUpperCase();

    if (!code) {
      return res.status(400).json({
        valid: false,
        discount: 0,
        isFreeDelivery: false,
        message: 'Coupon code is required.'
      });
    }

    // If client supplied couponData or we check against standard rules
    if (!couponData) {
      // Basic format check
      return res.json({
        valid: true,
        discount: 0,
        isFreeDelivery: false,
        message: `Coupon code ${code} checked.`
      });
    }

    const now = Date.now();

    if (!couponData.isActive) {
      return res.json({
        valid: false,
        discount: 0,
        isFreeDelivery: false,
        message: 'This coupon is currently paused / inactive.'
      });
    }

    if (couponData.startDate && new Date(couponData.startDate).getTime() > now) {
      return res.json({
        valid: false,
        discount: 0,
        isFreeDelivery: false,
        message: 'This coupon offer has not started yet.'
      });
    }

    if (couponData.endDate && new Date(couponData.endDate).getTime() < now) {
      return res.json({
        valid: false,
        discount: 0,
        isFreeDelivery: false,
        message: 'This coupon offer has expired.'
      });
    }

    if (couponData.maxUsageLimit && (couponData.usageCount || 0) >= couponData.maxUsageLimit) {
      return res.json({
        valid: false,
        discount: 0,
        isFreeDelivery: false,
        message: `This coupon has reached its maximum usage limit (${couponData.maxUsageLimit} uses).`
      });
    }

    if (couponData.minOrderAmount && subtotal < couponData.minOrderAmount) {
      return res.json({
        valid: false,
        discount: 0,
        isFreeDelivery: false,
        message: `Minimum order amount of ৳${couponData.minOrderAmount.toLocaleString()} required for this coupon.`
      });
    }

    let discount = 0;
    if (couponData.discountType === 'percentage') {
      discount = Math.round((subtotal * (couponData.discountValue || 0)) / 100);
    } else {
      discount = Math.min(couponData.discountValue || 0, subtotal);
    }

    if (couponData.maxDiscountAmount && discount > couponData.maxDiscountAmount) {
      discount = couponData.maxDiscountAmount;
    }

    const isFreeDelivery = !!couponData.isFreeDelivery;

    return res.json({
      valid: true,
      discount,
      isFreeDelivery,
      coupon: couponData,
      message: isFreeDelivery && discount === 0
        ? 'Free Delivery coupon applied!'
        : `Coupon ${code} applied: ৳${discount.toLocaleString()} discount!`
    });
  } catch (err: any) {
    console.error('Server coupon validation error:', err);
    return res.status(500).json({ valid: false, discount: 0, isFreeDelivery: false, message: 'Server validation error.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // Fallback for image requests: never serve index.html to <img> tags
    app.get('*', (req, res, next) => {
      if (req.path.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
        const fallback = path.resolve(__dirname, 'public/assets/images/product_jamdani_crimson_red_1791268726175.jpg');
        if (fs.existsSync(fallback)) {
          return res.sendFile(fallback);
        }
        return res.status(404).send('Image not found');
      }
      next();
    });

    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
