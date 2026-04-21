import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Flame, Droplets, Wind, Activity, LocateFixed } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

// Map fix for default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const icons = {
  'Flood': createCustomIcon('#3b82f6'),      // Blue
  'Cyclone': createCustomIcon('#a855f7'),    // Purple
  'Fire': createCustomIcon('#ef4444'),       // Red
  'Earthquake': createCustomIcon('#f97316'), // Orange
  'Default': createCustomIcon('#64748b')     // Gray
};

const getDisasterIconReact = (type) => {
    switch (type) {
        case 'Flood': return <Droplets className="w-5 h-5 text-blue-500" />;
        case 'Cyclone': return <Wind className="w-5 h-5 text-purple-500" />;
        case 'Fire': return <Flame className="w-5 h-5 text-red-500" />;
        case 'Earthquake': return <Activity className="w-5 h-5 text-orange-500" />;
        default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
};

const getSeverityColor = (severity) => {
    switch(severity) {
        case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
        case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
        case 'Low': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
        default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
}

// Controller component to zoom to user location
const LocationControl = () => {
    const map = useMap();
    const handleLocateMe = () => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, 10);
            L.marker(e.latlng).addTo(map).bindPopup("You are here!").openPopup();
        });
    }
    
    return (
        <button 
            onClick={handleLocateMe}
            className="absolute top-4 right-4 z-[400] bg-white text-slate-800 p-2 rounded-lg shadow-md hover:bg-gray-100"
            title="Locate Me"
        >
            <LocateFixed className="w-5 h-5" />
        </button>
    );
};

const LiveAlerts = () => {
    const { t } = useTranslation();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    // Default India Center
    const position = [20.5937, 78.9629]; 

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('alerts')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                if (data && data.length > 0) {
                    setAlerts(data);
                } else {
                    // Fallback Mock Data if database is empty
                    setAlerts([
                        { id: 1, title: 'Severe Flooding Warning', location: 'Assam', lat: 26.2006, lng: 92.9376, disaster_type: 'Flood', severity: 'High' },
                        { id: 2, title: 'Cyclone Biparjoy Path', location: 'Gujarat Coast', lat: 22.2587, lng: 71.1924, disaster_type: 'Cyclone', severity: 'High' },
                        { id: 3, title: 'Forest Fire Alert', location: 'Uttarakhand', lat: 30.0668, lng: 79.0193, disaster_type: 'Fire', severity: 'Medium' },
                        { id: 4, title: 'Mild Earth Tremors', location: 'Delhi NCR', lat: 28.7041, lng: 77.1025, disaster_type: 'Earthquake', severity: 'Low' }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch alerts from Supabase", err);
                setAlerts([
                    { id: 1, title: 'Severe Flooding Warning', location: 'Assam', lat: 26.2006, lng: 92.9376, disaster_type: 'Flood', severity: 'High' },
                    { id: 2, title: 'Cyclone Biparjoy Path', location: 'Gujarat Coast', lat: 22.2587, lng: 71.1924, disaster_type: 'Cyclone', severity: 'High' },
                    { id: 3, title: 'Forest Fire Alert', location: 'Uttarakhand', lat: 30.0668, lng: 79.0193, disaster_type: 'Fire', severity: 'Medium' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.disaster_type === filter);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
            
            {/* Map Section */}
            <div className="relative w-full lg:w-2/3 h-96 lg:h-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 z-10">
                <MapContainer center={position} zoom={5} className="w-full h-full text-black">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationControl />
                    
                    {filteredAlerts.map(alert => (
                        alert.lat && alert.lng && (
                            <Marker 
                                key={alert.id} 
                                position={[alert.lat, alert.lng]} 
                                icon={icons[alert.disaster_type] || icons['Default']}
                            >
                                <Popup className="custom-popup">
                                    <div className="font-sans">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getDisasterIconReact(alert.disaster_type)}
                                            <strong className="text-sm">{alert.title}</strong>
                                        </div>
                                        <p className="text-xs text-gray-600 !m-0 !mt-1">
                                            {alert.location} &bull; <span className="font-semibold text-red-600">{alert.severity} Severity</span>
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>
                
                {/* Visual Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg z-[400] text-xs">
                    <div className="font-bold mb-2 text-slate-800">Legend</div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div> <span className="text-slate-700">Flood</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full border border-white"></div> <span className="text-slate-700">Cyclone</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div> <span className="text-slate-700">Fire</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div> <span className="text-slate-700">Earthquake</span></div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="w-full lg:w-1/3 flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-4">{t('live_alerts_title')}</h3>
                    
                    {/* Filters */}
                    <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
                        {['All', 'Flood', 'Cyclone', 'Fire', 'Earthquake'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === type ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-y-auto p-4 space-y-3 flex-1">
                    {loading ? (
                        <div className="animate-pulse flex flex-col gap-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-24 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
                            ))}
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="text-center text-slate-500 py-10">
                            No alerts found for this category.
                        </div>
                    ) : (
                        filteredAlerts.map(alert => (
                            <div key={alert.id} className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                                            {getDisasterIconReact(alert.disaster_type)}
                                        </div>
                                        <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{alert.title}</h4>
                                    </div>
                                </div>
                                <div className="ml-10 text-sm text-slate-600 dark:text-slate-400">
                                    {alert.location}
                                </div>
                                <div className="ml-10 mt-3 flex items-center justify-between">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity} Severity
                                    </span>
                                    <span className="text-xs text-slate-400">Just now</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default LiveAlerts;
