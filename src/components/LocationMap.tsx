'use client';

import React, { useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing default markers in Leaflet Next.js builds
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

export default function LocationMap({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    // Default to a generic center (e.g., Dubai)
    const [position, setPosition] = useState<[number, number]>([25.2048, 55.2708]);

    const handleSetPosition = (p: [number, number]) => {
        setPosition(p);
        onLocationSelect(p[0], p[1]);
    };

    return (
        <div className="h-[300px] w-full rounded-[1.25rem] overflow-hidden border border-slate-200 shadow-inner relative z-0">
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
            </MapContainer>
        </div>
    );
}
