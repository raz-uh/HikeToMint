"use client";

import { useState, useEffect } from "react";

export interface Coordinates {
    lat: number;
    lng: number;
}

export const useGeolocation = (target: Coordinates) => {
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // metres
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in metres
    };

    const getPosition = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                const d = calculateDistance(latitude, longitude, target.lat, target.lng);
                setDistance(d);
                setError(null);
            },
            (err) => {
                setError(err.message);
            }
        );
    };

    const setManualPosition = (coords: Coordinates) => {
        setLocation(coords);
        const d = calculateDistance(coords.lat, coords.lng, target.lat, target.lng);
        setDistance(d);
        setError(null);
    };

    return { location, distance, error, getPosition, setManualPosition };
};
