'use client';

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Navigation, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for missing default markers in Leaflet Next.js builds
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map clicks and drop the pin
function LocationMarker({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

// Component to dynamically fly the camera to new GPS locations
function RecenterAutomatically({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, 16, { duration: 1.5 });
    }, [position, map]);
    return null;
}

export default function LocationMap({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    // Default to a generic center
    const [position, setPosition] = useState<[number, number]>([25.2048, 55.2708]);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');

    const handleSetPosition = (p: [number, number]) => {
        setPosition(p);
        onLocationSelect(p[0], p[1]);
    };

    const handleGetGPSLocation = () => {
        setIsLocating(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                handleSetPosition(newPos);
                setIsLocating(false);
            },
            (err) => {
                console.error(err);
                if (err.code === 1) setLocationError('Please allow location permissions in your browser settings.');
                else setLocationError('Failed to fetch GPS location. Please try again or click the map directly.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Click exactly where you want delivery
                </p>
                <button
                    type="button"
                    onClick={handleGetGPSLocation}
                    disabled={isLocating}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-xl hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all text-sm disabled:opacity-50"
                >
                    <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
                    {isLocating ? 'Finding you...' : 'Use My GPS Location'}
                </button>
            </div>

            {locationError && (
                <div className="p-3 mb-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-500/20">
                    {locationError}
                </div>
            )}

            {/* Rendered Interactive Map */}
            <div className="h-[350px] w-full rounded-[1.25rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner relative z-0">
                <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    {/* Using Google Maps standard XYZ Tile Server for visual styling */}
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        attribution='Google Maps'
                    />
                    <RecenterAutomatically position={position} />
                    <LocationMarker position={position} setPosition={handleSetPosition} />
                </MapContainer>
            </div>
        </div>
    );
}
