import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Check,
  Navigation,
  X,
  Building2,
  Compass,
  Truck,
  ShieldCheck,
  Crosshair,
  Map as MapIcon
} from 'lucide-react';
import { Language } from '../../types';

interface MapLocationPickerProps {
  language: Language;
  initialAddress?: string;
  onSelectCoordinates: (lat: number, lng: number, addressDesc: string, district?: string) => void;
  onClose: () => void;
}

// Preset delivery hubs across Bangladesh
interface DeliveryHub {
  id: string;
  nameEn: string;
  nameBn: string;
  areaEn: string;
  areaBn: string;
  lat: number;
  lng: number;
  district: string;
  division: string;
  courierZone: 'dhaka' | 'outside_dhaka';
  estimatedDelivery: string;
}

const PRESET_HUBS: DeliveryHub[] = [
  {
    id: 'dhanmondi',
    nameEn: 'Dhanmondi, Dhaka',
    nameBn: 'ধানমন্ডি, ঢাকা',
    areaEn: 'Road 27, Satmasjid Road, Dhanmondi',
    areaBn: 'রোড ২৭, সাতমসজিদ রোড, ধানমন্ডি',
    lat: 23.7461,
    lng: 90.3742,
    district: 'Dhaka',
    division: 'Dhaka',
    courierZone: 'dhaka',
    estimatedDelivery: '24-48 Hours'
  },
  {
    id: 'gulshan',
    nameEn: 'Gulshan 2, Dhaka',
    nameBn: 'গুলশান ২, ঢাকা',
    areaEn: 'Madani Avenue, Gulshan 2',
    areaBn: 'মাদানী এভিনিউ, গুলশান ২',
    lat: 23.7925,
    lng: 90.4078,
    district: 'Dhaka',
    division: 'Dhaka',
    courierZone: 'dhaka',
    estimatedDelivery: '24-48 Hours'
  },
  {
    id: 'banani',
    nameEn: 'Banani 11, Dhaka',
    nameBn: 'বনানী ১১, ঢাকা',
    areaEn: 'Road 11, Block D, Banani',
    areaBn: 'রোড ১১, ব্লক ডি, বনানী',
    lat: 23.7937,
    lng: 90.4043,
    district: 'Dhaka',
    division: 'Dhaka',
    courierZone: 'dhaka',
    estimatedDelivery: '24-48 Hours'
  },
  {
    id: 'uttara',
    nameEn: 'Uttara Sector 7, Dhaka',
    nameBn: 'উত্তরা সেক্টর ৭, ঢাকা',
    areaEn: 'Rabindra Sarani, Sector 7, Uttara',
    areaBn: 'রবীন্দ্র সরণি, সেক্টর ৭, উত্তরা',
    lat: 23.8759,
    lng: 90.3795,
    district: 'Dhaka',
    division: 'Dhaka',
    courierZone: 'dhaka',
    estimatedDelivery: '24-48 Hours'
  },
  {
    id: 'mirpur',
    nameEn: 'Mirpur 10 / DOHS, Dhaka',
    nameBn: 'মিরপুর ১০ / ডিওএইচএস, ঢাকা',
    areaEn: 'Mirpur Circle 10 & Mirpur DOHS',
    areaBn: 'মিরপুর গোলচত্বর ১০ ও মিরপুর ডিওএইচএস',
    lat: 23.8069,
    lng: 90.3687,
    district: 'Dhaka',
    division: 'Dhaka',
    courierZone: 'dhaka',
    estimatedDelivery: '24-48 Hours'
  },
  {
    id: 'old-dhaka',
    nameEn: 'Old Dhaka / Lalbagh',
    nameBn: 'পুরান ঢাকা / লালবাগ',
    areaEn: 'Lalbagh Fort Road, Old Dhaka',
    areaBn: 'লালবাগ কেল্লা রোড, পুরান ঢাকা',
    lat: 23.7180,
    lng: 90.3882,
    district: 'Dhaka',
    division: 'Dhaka',
    courierZone: 'dhaka',
    estimatedDelivery: '24-48 Hours'
  },
  {
    id: 'rupganj',
    nameEn: 'Rupganj Jamdani Hub, Narayanganj',
    nameBn: 'রূপগঞ্জ জামদানি পল্লী, নারায়ণগঞ্জ',
    areaEn: 'Noapara Jamdani Weaving Village, Rupganj',
    areaBn: 'নোয়াপাড়া জামদানি তাঁত পল্লী, রূপগঞ্জ',
    lat: 23.7915,
    lng: 90.5284,
    district: 'Narayanganj',
    division: 'Dhaka',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'chattogram-agrabad',
    nameEn: 'Agrabad C/A, Chattogram',
    nameBn: 'আগ্রাবাদ বা/এ, চট্টগ্রাম',
    areaEn: 'Agrabad Commercial Area, Chattogram',
    areaBn: 'আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম',
    lat: 22.3259,
    lng: 91.8131,
    district: 'Chattogram',
    division: 'Chattogram',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'chattogram-gec',
    nameEn: 'GEC Circle, Chattogram',
    nameBn: 'জিইসি মোড়, চট্টগ্রাম',
    areaEn: 'Nasirabad & GEC More, Chattogram',
    areaBn: 'নাসিরাবাদ ও জিইসি মোড়, চট্টগ্রাম',
    lat: 22.3592,
    lng: 91.8219,
    district: 'Chattogram',
    division: 'Chattogram',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'sylhet',
    nameEn: 'Zindabazar, Sylhet',
    nameBn: 'জিন্দাবাজার, সিলেট',
    areaEn: 'Zindabazar Point, Sylhet City',
    areaBn: 'জিন্দাবাজার পয়েন্ট, সিলেট সদর',
    lat: 24.8949,
    lng: 91.8687,
    district: 'Sylhet',
    division: 'Sylhet',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'rajshahi',
    nameEn: 'Saheb Bazar, Rajshahi',
    nameBn: 'সাহেব বাজার, রাজশাহী',
    areaEn: 'Zero Point, Saheb Bazar, Rajshahi',
    areaBn: 'জিরো পয়েন্ট, সাহেব বাজার, রাজশাহী',
    lat: 24.3636,
    lng: 88.6241,
    district: 'Rajshahi',
    division: 'Rajshahi',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'khulna',
    nameEn: 'Shibbari More, Khulna',
    nameBn: 'শিববাড়ী মোড়, খুলনা',
    areaEn: 'KDA Avenue, Shibbari, Khulna',
    areaBn: 'কেডিএ এভিনিউ, শিববাড়ী, খুলনা',
    lat: 22.8200,
    lng: 89.5500,
    district: 'Khulna',
    division: 'Khulna',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'barishal',
    nameEn: 'Sadar Road, Barishal',
    nameBn: 'সদর রোড, বরিশাল',
    areaEn: 'Chawkbazar & Sadar Road, Barishal',
    areaBn: 'চকবাজার ও সদর রোড, বরিশাল',
    lat: 22.7010,
    lng: 90.3535,
    district: 'Barishal',
    division: 'Barishal',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'comilla',
    nameEn: 'Kandirpar, Cumilla',
    nameBn: 'কান্দিরপাড়, কুমিল্লা',
    areaEn: 'Kandirpar Chowrasta, Cumilla City',
    areaBn: 'কান্দিরপাড় চৌরাস্তা, কুমিল্লা',
    lat: 23.4607,
    lng: 91.1809,
    district: 'Cumilla',
    division: 'Chattogram',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'gazipur',
    nameEn: 'Chowrasta, Gazipur',
    nameBn: 'চৌরাস্তা, গাজীপুর',
    areaEn: 'Gazipur Chowrasta, Joydebpur',
    areaBn: 'গাজীপুর চৌরাস্তা, জয়দেবপুর',
    lat: 23.9999,
    lng: 90.4203,
    district: 'Gazipur',
    division: 'Dhaka',
    courierZone: 'outside_dhaka',
    estimatedDelivery: '48-72 Hours'
  },
  {
    id: 'savar',
    nameEn: 'Savar Bus Stand, Dhaka',
    nameBn: 'সাভার বাস স্ট্যান্ড, ঢাকা',
    areaEn: 'Savar Bazar Road, Savar',
    areaBn: 'সাভার বাজার রোড, সাভার',
    lat: 23.8441,
    lng: 90.2571,
    district: 'Dhaka',
    division: 'Dhaka',
    courierZone: 'dhaka',
    estimatedDelivery: '24-48 Hours'
  }
];

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  language,
  initialAddress = '',
  onSelectCoordinates,
  onClose
}) => {
  // Initial coordinates default to Dhaka Center
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: 23.8103,
    lng: 90.4125
  });

  const [currentAddress, setCurrentAddress] = useState<string>(
    initialAddress || 'House 14, Road 7, Dhanmondi, Dhaka'
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dhaka');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'interactive-map' | 'popular-hubs'>('interactive-map');

  // Filter hubs based on search query
  const filteredHubs = useMemo(() => {
    if (!searchQuery.trim()) return PRESET_HUBS;
    const q = searchQuery.toLowerCase().trim();
    return PRESET_HUBS.filter(
      (hub) =>
        hub.nameEn.toLowerCase().includes(q) ||
        hub.nameBn.includes(q) ||
        hub.areaEn.toLowerCase().includes(q) ||
        hub.areaBn.includes(q) ||
        hub.district.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle clicking on preset hub
  const handleSelectHub = (hub: DeliveryHub) => {
    setSelectedCoords({ lat: hub.lat, lng: hub.lng });
    const formattedDesc =
      language === 'bn'
        ? `${hub.areaBn}, ${hub.nameBn}`
        : `${hub.areaEn}, ${hub.nameEn}`;
    setCurrentAddress(formattedDesc);
    setSelectedDistrict(hub.district);
  };

  // Handle clicking on the interactive visual map canvas
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const widthRatio = Math.max(0, Math.min(1, x / rect.width));
    const heightRatio = Math.max(0, Math.min(1, y / rect.height));

    // Bangladesh bounding box approx:
    // Lat: 20.6° to 26.5° N (inverted Y axis)
    // Lng: 88.0° to 92.6° E
    const lat = 26.5 - heightRatio * (26.5 - 20.6);
    const lng = 88.0 + widthRatio * (92.6 - 88.0);

    const roundedLat = parseFloat(lat.toFixed(4));
    const roundedLng = parseFloat(lng.toFixed(4));

    setSelectedCoords({ lat: roundedLat, lng: roundedLng });

    // Determine nearest hub for context
    let nearestHub = PRESET_HUBS[0];
    let minDistance = 999;
    PRESET_HUBS.forEach((hub) => {
      const d = Math.hypot(hub.lat - roundedLat, hub.lng - roundedLng);
      if (d < minDistance) {
        minDistance = d;
        nearestHub = hub;
      }
    });

    const isDhakaNear = minDistance < 0.4 && nearestHub.courierZone === 'dhaka';
    setSelectedDistrict(nearestHub.district);

    const updatedText =
      language === 'bn'
        ? `পিনপয়েন্ট লোকেশন (${nearestHub.nameBn} এর কাছাকাছি, অক্ষাংশ: ${roundedLat}, দ্রাঘিমাংশ: ${roundedLng})`
        : `Pinned Location (Near ${nearestHub.nameEn}, Lat: ${roundedLat}, Lng: ${roundedLng})`;
    setCurrentAddress(updatedText);
  };

  // Confirm selection
  const handleConfirm = () => {
    onSelectCoordinates(
      selectedCoords.lat,
      selectedCoords.lng,
      currentAddress,
      selectedDistrict
    );
    onClose();
  };

  // Calculate pin position on map canvas (0-100%)
  const pinXPercent = useMemo(() => {
    const ratio = (selectedCoords.lng - 88.0) / (92.6 - 88.0);
    return Math.max(5, Math.min(95, ratio * 100));
  }, [selectedCoords.lng]);

  const pinYPercent = useMemo(() => {
    const ratio = (26.5 - selectedCoords.lat) / (26.5 - 20.6);
    return Math.max(5, Math.min(95, ratio * 100));
  }, [selectedCoords.lat]);

  const isDhakaCourier = selectedDistrict.toLowerCase().includes('dhaka');

  return (
    <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-900 text-white border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-white">
                  {language === 'bn'
                    ? 'ডেলিভারি লোকেশন ও ডোরস্টেপ পিনপয়েন্ট'
                    : 'Delivery Location & Doorstep Pinpoint'}
                </h3>
                <span className="text-[10px] bg-emerald-500 text-stone-950 px-2 py-0.5 rounded-full font-sans font-bold tracking-wider">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {language === 'bn'
                  ? 'ম্যাপে ট্যাপ করে নির্দিষ্ট ঠিকানা পিন করুন অথবা ডেলিভারি হাব বেছে নিন'
                  : 'Tap the interactive map to pin your exact doorstep or select a delivery hub'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Quick Search */}
          <div className="relative">
            <label className="block text-stone-700 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              {language === 'bn' ? 'এলাকা বা হাব খুঁজুন' : 'Search Area / Delivery Hub'}
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: ধানমন্ডি, বনানী, উত্তরা, মিরপুর, পুরান ঢাকা, সিলেট, চট্টগ্রাম, রূপগঞ্জ...'
                    : 'e.g. Dhanmondi, Banani, Uttara, Mirpur, Sylhet, Chattogram, Rupganj...'
                }
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-900/30 focus:border-amber-900"
              />
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex border-b border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab('interactive-map')}
              className={`pb-2 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'interactive-map'
                  ? 'border-amber-900 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ইন্টারেক্টিভ ডেলিভারি ম্যাপ' : 'Interactive Map Pinpoint'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('popular-hubs')}
              className={`pb-2 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'popular-hubs'
                  ? 'border-amber-900 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>
                {language === 'bn' ? 'জনপ্রিয় হাব তালিকা' : 'Delivery Hubs List'} ({filteredHubs.length})
              </span>
            </button>
          </div>

          {/* Interactive Map Canvas View */}
          {activeTab === 'interactive-map' && (
            <div className="space-y-2">
              <div
                onClick={handleMapCanvasClick}
                className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-stone-300 shadow-inner bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 cursor-crosshair select-none group"
              >
                {/* Map Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #f59e0b 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Stylized River & Highway Arteries */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
                  <path
                    d="M 50 20 Q 200 120 280 160 T 450 240 T 580 290"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeDasharray="4 2"
                  />
                  <path
                    d="M 120 0 Q 260 90 320 180 T 360 280"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0 140 Q 180 150 320 180 T 600 210"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                </svg>

                {/* Preset Hub Markers on the Map */}
                {PRESET_HUBS.map((hub) => {
                  const hubX = Math.max(5, Math.min(95, ((hub.lng - 88.0) / (92.6 - 88.0)) * 100));
                  const hubY = Math.max(5, Math.min(95, ((26.5 - hub.lat) / (26.5 - 20.6)) * 100));
                  const isSelected =
                    Math.abs(hub.lat - selectedCoords.lat) < 0.05 &&
                    Math.abs(hub.lng - selectedCoords.lng) < 0.05;

                  return (
                    <div
                      key={hub.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHub(hub);
                      }}
                      style={{ left: `${hubX}%`, top: `${hubY}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group/hub"
                      title={hub.nameEn}
                    >
                      <div
                        className={`w-3 h-3 rounded-full border-2 transition-transform ${
                          isSelected
                            ? 'bg-amber-400 border-white scale-125 ring-4 ring-amber-400/40'
                            : 'bg-stone-300 border-stone-800 hover:scale-125 hover:bg-amber-300'
                        }`}
                      />
                      <span className="hidden sm:block absolute left-3.5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-sans font-medium px-1.5 py-0.5 rounded bg-stone-950/80 text-stone-200 border border-stone-700 pointer-events-none opacity-0 group-hover/hub:opacity-100 transition-opacity">
                        {language === 'bn' ? hub.nameBn : hub.nameEn}
                      </span>
                    </div>
                  );
                })}

                {/* Selected Pinpoint Marker with Pulse Animation */}
                <div
                  style={{ left: `${pinXPercent}%`, top: `${pinYPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full z-20 pointer-events-none transition-all duration-200"
                >
                  <div className="relative flex flex-col items-center">
                    <span className="absolute -bottom-1 w-4 h-2 bg-black/60 rounded-full blur-[2px]" />
                    <div className="p-1.5 rounded-full bg-red-600 text-white shadow-lg border-2 border-white animate-bounce">
                      <MapPin className="w-5 h-5 fill-white text-red-600" />
                    </div>
                    <span className="w-6 h-6 rounded-full bg-red-500/30 animate-ping absolute -bottom-2" />
                  </div>
                </div>

                {/* Floating Coordinate Badge */}
                <div className="absolute top-3 left-3 bg-stone-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono shadow-md border border-stone-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Lat: {selectedCoords.lat.toFixed(4)}, Lng: {selectedCoords.lng.toFixed(4)}
                  </span>
                </div>

                {/* Map Interactive Tip */}
                <div className="absolute bottom-3 right-3 bg-stone-900/85 backdrop-blur-sm text-amber-300 px-3 py-1 rounded-lg text-[10px] font-semibold border border-amber-500/30 flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>
                    {language === 'bn'
                      ? 'ম্যাপের যে কোন স্থানে ক্লিক করে পিন ড্রপ করুন'
                      : 'Click anywhere to reposition doorstep pin'}
                  </span>
                </div>

                {/* Legend Watermark */}
                <div className="absolute bottom-3 left-3 text-[10px] text-stone-400 font-serif">
                  <span>Steadfast & Pathao Courier Grid · Bangladesh</span>
                </div>
              </div>

              {/* Quick Hub Preset Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">
                  {language === 'bn' ? 'জনপ্রিয় ডেলিভারি হাব (এক ক্লিকে নির্বাচন করুন):' : 'Popular Delivery Hubs (1-Click Select):'}
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-200">
                  {PRESET_HUBS.slice(0, 10).map((hub) => (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => handleSelectHub(hub)}
                      className="px-2.5 py-1 text-[11px] rounded-lg border border-stone-200 bg-white hover:bg-amber-100 hover:border-amber-400 text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Building2 className="w-3 h-3 text-amber-800" />
                      <span>{language === 'bn' ? hub.nameBn : hub.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Popular Hubs List View */}
          {activeTab === 'popular-hubs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
              {filteredHubs.map((hub) => (
                <div
                  key={hub.id}
                  onClick={() => handleSelectHub(hub)}
                  className="p-3 bg-stone-50 hover:bg-amber-50/80 rounded-xl border border-stone-200 hover:border-amber-300 transition-all cursor-pointer flex items-start gap-2.5"
                >
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-xs">
                      {language === 'bn' ? hub.nameBn : hub.nameEn}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {language === 'bn' ? hub.areaBn : hub.areaEn}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      <span className="text-amber-800 font-medium">
                        {hub.courierZone === 'dhaka' ? 'ঢাকা সিটি (৳৮০)' : 'ঢাকার বাইরে (৳১৩০)'}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">{hub.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Address Details Input */}
          <div className="space-y-1.5">
            <label className="block text-stone-700 font-semibold text-[11px] uppercase tracking-wider">
              {language === 'bn' ? 'পূর্ণাঙ্গ ঠিকানা ও বিবরণ' : 'Detailed Delivery Address'}
            </label>
            <textarea
              rows={2}
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
              placeholder="House, Road, Area, Sector, Police Station, District..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-900/30 focus:border-amber-900"
            />
          </div>

          {/* Courier Zone Status Bar */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-950">
                  {isDhakaCourier
                    ? language === 'bn'
                      ? 'ঢাকা সিটি ডেলিভারি (৳৮০ চার্জ)'
                      : 'Inside Dhaka Delivery (৳80 Rate)'
                    : language === 'bn'
                    ? 'ঢাকার বাইরে ডেলিভারি (৳১৩০ চার্জ)'
                    : 'Outside Dhaka Delivery (৳130 Rate)'}
                </p>
                <p className="text-[11px] text-stone-600">
                  {language === 'bn'
                    ? `জেলা: ${selectedDistrict} · ক্যাশ অন ডেলিভারি প্রযোজ্য`
                    : `District: ${selectedDistrict} · Cash on Delivery Supported`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'bn' ? 'হোম ডেলিভারি' : 'Doorstep'}</span>
            </div>
          </div>

        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-50 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>
              {language === 'bn'
                ? 'এই ঠিকানা নিশ্চিত করুন'
                : 'Confirm & Pin This Address'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
