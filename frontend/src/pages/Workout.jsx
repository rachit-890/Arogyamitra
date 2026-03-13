import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Workout = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generatePlan = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/ai/workout-plan', {
                goal: 'Weight Loss', // Typically fetched from profile, mock for now or use profile API
                workout_type: 'Home Workouts',
                time_minutes: 30
            });
            if(res.data?.plan) {
               setPlan(res.data.plan);
               localStorage.setItem('workoutPlan', JSON.stringify(res.data.plan));
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
        const saved = localStorage.getItem('workoutPlan');
        if (saved) {
            try { setPlan(JSON.parse(saved)); } catch(e){}
        }
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300 font-medium tracking-wider">ArogyaMitra AI is crafting your plan...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative">
            <h2 className="text-3xl font-display font-bold mb-8 flex justify-between items-center">
                <span>7-Day Workout Plan</span>
                <button onClick={generatePlan} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                    🔄 Regenerate Plan
                </button>
            </h2>

            {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>}

            {!plan ? (
                <div className="card text-center py-20">
                    <div className="text-6xl mb-4">🏃‍♂️</div>
                    <h3 className="text-2xl font-bold mb-2">No active plan found</h3>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">Generate a personalized 7-day workout plan based on your unique health profile, injuries, and goals.</p>
                    <button onClick={generatePlan} className="btn-primary py-3 px-8 text-lg">Generate AI Plan</button>
                </div>
            ) : (
                <div className="space-y-6">
                    {Array.isArray(plan) ? plan.map((dayPlan, i) => (
                        <div key={i} className="card relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:bg-emerald-400 transition-colors"></div>
                           <h3 className="text-xl font-bold mb-1 text-primary">Day {dayPlan.day}: {dayPlan.focus}</h3>
                           <p className="text-sm text-slate-400 mb-4">{dayPlan.daily_tip}</p>
                           
                           <div className="mb-4">
                               <h4 className="font-semibold text-slate-200 mb-2">Warmup</h4>
                               <p className="text-slate-300 text-sm bg-slate-800/50 p-3 rounded-lg">{dayPlan.warmup}</p>
                           </div>

                           <div>
                               <h4 className="font-semibold text-slate-200 mb-2">Exercises</h4>
                               <ul className="space-y-2">
                                   {Array.isArray(dayPlan.exercises) && dayPlan.exercises.map((ex, j) => (
                                       <li key={j} className="text-sm text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center hover:border-slate-600 transition-colors">
                                            <span>{typeof ex === 'object' ? ex.name : ex}</span>
                                            <a href="https://youtube.com/results?search_query=workout+exercise" target="_blank" rel="noreferrer" className="text-secondary hover:text-blue-400 text-xs">Watch Video &#x2197;</a>
                                       </li>
                                   ))}
                               </ul>
                           </div>
                           <div className="mt-4 pt-4 border-t border-slate-700/50">
                               <button className="text-primary hover:text-emerald-400 font-medium text-sm flex items-center gap-1">
                                   ✓ Mark complete & earn Charity Points
                               </button>
                           </div>
                        </div>
                    )) : <p className="text-red-400">Invalid AI response format</p>}
                </div>
            )}
        </div>
    );
};

export default Workout;
