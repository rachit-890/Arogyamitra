import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Nutrition = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generatePlan = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/ai/meal-plan', {
                calories: 2000, 
                diet: 'Vegetarian',
                allergies: 'None'
            });
            if(res.data?.plan) {
               setPlan(res.data.plan);
               localStorage.setItem('mealPlan', JSON.stringify(res.data.plan));
            } else {
               setError("Failed to parse AI response.");
            }
        } catch (err) {
            setError(err.message || "Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('mealPlan');
        if (saved) {
            try { setPlan(JSON.parse(saved)); } catch(e){}
        }
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300 font-medium tracking-wider">ArogyaMitra AI is crafting your nutrition plan...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto animate-fade-in relative">
            <h2 className="text-3xl font-display font-bold mb-8 flex justify-between items-center">
                <span>7-Day Meal Plan</span>
                <button onClick={generatePlan} className="bg-secondary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-lg shadow-secondary/30">
                    🔄 Regenerate Plan
                </button>
            </h2>

            {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>}

            {!plan ? (
                <div className="card text-center py-20">
                    <div className="text-6xl mb-4">🥗</div>
                    <h3 className="text-2xl font-bold mb-2">No active meal plan</h3>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">Get a personalized, calorie-counted menu catering to your Indian cuisine tastes, dietary choices, and allergies.</p>
                    <button onClick={generatePlan} className="bg-secondary hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg shadow-secondary/30 transition-colors text-lg">Generate Diet Plan</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Array.isArray(plan) ? plan.map((dayPlan, i) => (
                        <div key={i} className="card relative overflow-hidden pb-4">
                           <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                           <h3 className="text-xl font-bold mb-4 text-secondary">Day {dayPlan.day}</h3>
                           
                           <div className="space-y-4">
                               <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                                   <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Breakfast</span>
                                   <p className="text-slate-200 mt-1 text-sm">{typeof dayPlan.breakfast === 'object' ? JSON.stringify(dayPlan.breakfast) : dayPlan.breakfast}</p>
                               </div>
                               <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                                   <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lunch</span>
                                   <p className="text-slate-200 mt-1 text-sm">{typeof dayPlan.lunch === 'object' ? JSON.stringify(dayPlan.lunch) : dayPlan.lunch}</p>
                               </div>
                               <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                                   <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Snacks</span>
                                   <p className="text-slate-200 mt-1 text-sm">{typeof dayPlan.snacks === 'object' ? JSON.stringify(dayPlan.snacks) : dayPlan.snacks}</p>
                               </div>
                               <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                                   <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Dinner</span>
                                   <p className="text-slate-200 mt-1 text-sm">{typeof dayPlan.dinner === 'object' ? JSON.stringify(dayPlan.dinner) : dayPlan.dinner}</p>
                               </div>
                               <div className="mt-4 pt-3 border-t border-slate-700">
                                   <p className="text-xs text-secondary font-medium">{typeof dayPlan.macro_breakdown === 'object' ? JSON.stringify(dayPlan.macro_breakdown) : dayPlan.macro_breakdown}</p>
                               </div>
                           </div>
                        </div>
                    )) : <p className="text-red-400">Invalid AI response format</p>}
                </div>
            )}
        </div>
    );
};

export default Nutrition;
