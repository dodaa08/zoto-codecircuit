'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import LocationTracker from '../LocationTracker';

export default function Hero() {
    const [showLocationTracker, setShowLocationTracker] = useState(false);
    const headlines = [
        "Find Your Perfect Restaurant 🍽️",
        "Discover Hidden Gems Near You 🔍",
        "Rate with Emojis 😋",
        "Filter by Cuisine 🍜",
        "Get Personalized Recommendations 🎯",
        "Share Your Food Journey 📸",
        "Explore Local Favorites 🌟",
        "Find Spicy Delights 🌶️",
        "Discover Sweet Treats 🍰",
        "Try New Flavors 🆕"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleFindRestaurants = () => {
        setShowLocationTracker(true);
    };

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-black to-black-900">
            {/* Content */}
            <div className="text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="h-[120px] md:h-[160px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-5xl font-bold absolute"
                            >
                                {headlines[currentIndex]}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                    <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
                        Your AI-powered restaurant companion
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleFindRestaurants}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors w-full md:w-auto"
                        >
                            Find Restaurants
                        </motion.button>
                        {/* <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="border border-orange-500 text-orange-500 px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-500/10 transition-colors w-full md:w-auto"
                        >
                            How It Works
                        </motion.button> */}
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-3xl"></div>

            {/* Location Tracker */}
            {showLocationTracker && <LocationTracker />}
        </section>
    );
}