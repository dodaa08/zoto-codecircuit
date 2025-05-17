'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Relaxed', value: 'relaxed' },
    { emoji: '🎉', label: 'Celebratory', value: 'celebratory' },
    { emoji: '😋', label: 'Hungry', value: 'hungry' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
];

const tastePreferences = [
    { label: 'Spicy', value: 'spicy', icon: '🌶️' },
    { label: 'Sweet', value: 'sweet', icon: '🍯' },
    { label: 'Savory', value: 'savory', icon: '🧂' },
    { label: 'Tangy', value: 'tangy', icon: '🍋' },
    { label: 'Rich', value: 'rich', icon: '🍫' },
];

const cuisines = [
    { label: 'Indian', value: 'indian', flag: '🇮🇳' },
    { label: 'Italian', value: 'italian', flag: '🇮🇹' },
    { label: 'Chinese', value: 'chinese', flag: '🇨🇳' },
    { label: 'Mexican', value: 'mexican', flag: '🇲🇽' },
    { label: 'Japanese', value: 'japanese', flag: '🇯🇵' },
    { label: 'Thai', value: 'thai', flag: '🇹🇭' },
    { label: 'Korean', value: 'korean', flag: '🇰🇷' },
    { label: 'Mediterranean', value: 'mediterranean', flag: '🌊' },
];

const dietaryPreferences = [
    { label: 'Vegetarian', value: 'vegetarian', icon: '🥗' },
    { label: 'Vegan', value: 'vegan', icon: '🌱' },
    { label: 'Gluten-Free', value: 'gluten-free', icon: '🌾' },
    { label: 'Halal', value: 'halal', icon: '🕌' },
    { label: 'Keto', value: 'keto', icon: '🥑' },
];

const mealTypes = [
    { label: 'Breakfast', value: 'breakfast', icon: '☕' },
    { label: 'Lunch', value: 'lunch', icon: '🍱' },
    { label: 'Dinner', value: 'dinner', icon: '🍽️' },
    { label: 'Snacks', value: 'snacks', icon: '🥨' },
    { label: 'Dessert', value: 'dessert', icon: '🍰' },
];

export default function FindRest() {
    const [selectedMood, setSelectedMood] = useState('');
    const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedMealType, setSelectedMealType] = useState('');
    const [budget, setBudget] = useState('medium');
    const [showModal, setShowModal] = useState(false);
    const [foodPreference, setFoodPreference] = useState('');
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTasteToggle = (taste: string) => {
        setSelectedTastes(prev => 
            prev.includes(taste) 
                ? prev.filter(t => t !== taste)
                : [...prev, taste]
        );
    };

    const handleCuisineToggle = (cuisine: string) => {
        setSelectedCuisines(prev => 
            prev.includes(cuisine) 
                ? prev.filter(c => c !== cuisine)
                : [...prev, cuisine]
        );
    };

    const handleDietaryToggle = (diet: string) => {
        setSelectedDietary(prev => 
            prev.includes(diet) 
                ? prev.filter(d => d !== diet)
                : [...prev, diet]
        );
    };

    const handleFindRestaurants = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log('Starting restaurant search...');

            // Validate required selections
            if (!selectedCuisines.length) {
                throw new Error('Please select at least one cuisine');
            }

            // Get user's current location
            console.log('Getting user location...');
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    (error) => {
                        console.error('Geolocation error:', error);
                        reject(new Error('Please enable location access to find restaurants'));
                    },
                    { timeout: 5000 }
                );
            });

            console.log('Location obtained:', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });

            const requestBody = {
                mood: selectedMood,
                tastes: selectedTastes,
                cuisines: selectedCuisines,
                dietary: selectedDietary,
                mealType: selectedMealType,
                budget: budget,
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                foodPreference: foodPreference
            };

            console.log('Sending request with preferences:', requestBody);

            const response = await fetch('/api/filterRest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch restaurants');
            }

            if (!data.restaurants || data.restaurants.length === 0) {
                throw new Error('No restaurants found matching your preferences');
            }

            setRestaurants(data.restaurants);
            console.log('Successfully found restaurants:', data.restaurants.length);
        } catch (err) {
            console.error('Error finding restaurants:', err);
            setError(err instanceof Error ? err.message : 'Failed to find restaurants');
            setRestaurants([]); // Clear any previous results
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white">
            {/* Header */}
            <header className="border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/">
                    <h1 className="text-4xl font-bold text-orange-400">Zoto</h1>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <h2 className="text-2xl font-semibold mb-8 text-center">
                        Tell us about your mood and taste
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Mood Selection */}
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-medium mb-4">How are you feeling today?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {moods.map((mood) => (
                                    <motion.button
                                        key={mood.value}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedMood(mood.value)}
                                        className={`p-3 rounded-lg border-2 transition-colors ${
                                            selectedMood === mood.value
                                                ? 'border-orange-400 bg-orange-400/10'
                                                : 'border-gray-700 hover:border-orange-400/50'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{mood.emoji}</div>
                                        <div className="text-sm">{mood.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Cuisine Selection */}
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-medium mb-4">What cuisines do you prefer?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {cuisines.map((cuisine) => (
                                    <motion.button
                                        key={cuisine.value}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCuisineToggle(cuisine.value)}
                                        className={`p-3 rounded-lg border-2 transition-colors ${
                                            selectedCuisines.includes(cuisine.value)
                                                ? 'border-orange-400 bg-orange-400/10'
                                                : 'border-gray-700 hover:border-orange-400/50'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{cuisine.flag}</div>
                                        <div className="text-sm">{cuisine.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Taste Preferences */}
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-medium mb-4">What flavors do you prefer?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {tastePreferences.map((taste) => (
                                    <motion.button
                                        key={taste.value}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleTasteToggle(taste.value)}
                                        className={`p-3 rounded-lg border-2 transition-colors ${
                                            selectedTastes.includes(taste.value)
                                                ? 'border-orange-400 bg-orange-400/10'
                                                : 'border-gray-700 hover:border-orange-400/50'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{taste.icon}</div>
                                        <div className="text-sm">{taste.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Preferences */}
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-medium mb-4">Any dietary preferences?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {dietaryPreferences.map((diet) => (
                                    <motion.button
                                        key={diet.value}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDietaryToggle(diet.value)}
                                        className={`p-3 rounded-lg border-2 transition-colors ${
                                            selectedDietary.includes(diet.value)
                                                ? 'border-orange-400 bg-orange-400/10'
                                                : 'border-gray-700 hover:border-orange-400/50'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{diet.icon}</div>
                                        <div className="text-sm">{diet.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Meal Type */}
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-medium mb-4">What type of meal?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {mealTypes.map((meal) => (
                                    <motion.button
                                        key={meal.value}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedMealType(meal.value)}
                                        className={`p-3 rounded-lg border-2 transition-colors ${
                                            selectedMealType === meal.value
                                                ? 'border-orange-400 bg-orange-400/10'
                                                : 'border-gray-700 hover:border-orange-400/50'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{meal.icon}</div>
                                        <div className="text-sm">{meal.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Budget Selection */}
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-medium mb-4">What's your budget?</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {['low', 'medium', 'high'].map((option) => (
                                    <motion.button
                                        key={option}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setBudget(option)}
                                        className={`p-3 rounded-lg border-2 transition-colors ${
                                            budget === option
                                                ? 'border-orange-400 bg-orange-400/10'
                                                : 'border-gray-700 hover:border-orange-400/50'
                                        }`}
                                    >
                                        <div className="text-sm capitalize">{option}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className="mt-8 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowModal(true)}
                                className="w-76 md:w-96 py-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-500 transition-colors"
                            >
                                Write down exactly what you want to eat
                            </motion.button>
                        </div>

                        <div className='mt-10 flex justify-center'>
                            <h1 className='text-xl font-medium'>Ya Phir</h1>
                        </div>

                        <div className="mt-8 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleFindRestaurants}
                                disabled={isLoading}
                                className={`w-full md:w-72 py-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-500 transition-colors ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? 'Finding Restaurants...' : 'Find My Perfect Restaurant!'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 text-red-500 text-center">
                            {error}
                        </div>
                    )}

                    {/* Restaurant Results */}
                    {restaurants.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.map((restaurant, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
                                >
                                    <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                                    <p className="text-gray-400 mb-4">{restaurant.description}</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Cuisine:</span>
                                            <span>{restaurant.cuisine}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Price Range:</span>
                                            <span>{restaurant.price_range}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-400">★</span>
                                            <span>{restaurant.rating}/5</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Location:</span>
                                            <span>{restaurant.location}</span>
                                        </div>
                                        {restaurant.highlights && restaurant.highlights.length > 0 && (
                                            <div>
                                                <span className="text-gray-400">Highlights:</span>
                                                <ul className="list-disc list-inside mt-1">
                                                    {restaurant.highlights.map((highlight: string, i: number) => (
                                                        <li key={i} className="text-sm">{highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
                                            <div>
                                                <span className="text-gray-400">Dietary Options:</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {restaurant.dietary_options.map((option: string, i: number) => (
                                                        <span key={i} className="text-sm bg-gray-700 px-2 py-1 rounded">
                                                            {option}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Modal */}
                    <AnimatePresence>
                        {showModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                onClick={() => setShowModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-black focus:outline-none rounded-xl p-6 py-20 w-full max-w-2xl border border-gray-700"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-orange-400">Tell us exactly what you want to eat</h3>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <textarea
                                        value={foodPreference}
                                        onChange={(e) => setFoodPreference(e.target.value)}
                                        placeholder="Describe your perfect meal... For example: 'I'm craving something spicy with lots of cheese, maybe a fusion of Indian and Italian flavors...'"
                                        className="w-full focus:outline-none h-72 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                                    />
                                    <div className="flex justify-end gap-4 mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2 rounded-lg border border-gray-700 hover:border-orange-400 transition-colors"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                // Handle the food preference submission
                                                setShowModal(false);
                                            }}
                                            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-500 transition-colors"
                                        >
                                            Submit
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}