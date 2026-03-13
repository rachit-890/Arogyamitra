import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Progress = () => {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/progress')
            .then(res => setProgress(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const markWorkoutComplete = async () => {
        try {
            await api.post('/progress/update', {
                calories_burned: 300,
                workout_completed: true,
                charity_points: 50
            });
            // Refresh
            const res = await api.get('/progress');
            setProgress(res.data);
        } catch(e) {
            console.error(e);
        }
    }

    if (loading) return <div className="text-center mt-20 text-slate-400 text-xl animate-pulse">Loading Progress Data...</div>;

    const totalCharity = progress.reduce((acc, curr) => acc + curr.charity_points, 0);
    const totalCals = progress.reduce((acc, curr) => acc + curr.calories_burned, 0);
    const workoutsDone = progress.filter(p => p.workout_completed).length;

    return (
        <div className="max-w-5xl mx-auto animate-fade-in relative z-10">
            <h2 className="text-3xl font-display font-bold mb-8">Your Journey</h2>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="card text-center bg-gradient-to-br from-slate-800 to-slate-900 border-t-2 border-t-primary">
                    <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Workouts Completed</p>
                    <p className="text-5xl font-bold font-display text-primary">{workoutsDone}</p>
                </div>
                <div className="card text-center bg-gradient-to-br from-slate-800 to-slate-900 border-t-2 border-t-secondary">
                    <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Calories Burned</p>
                    <p className="text-5xl font-bold font-display text-secondary">{totalCals}</p>
                </div>
                <div className="card text-center bg-gradient-to-br from-slate-800 to-slate-900 border-t-2 border-t-accent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-full blur-xl -z-10"></div>
                    <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Charity Points Earned</p>
                    <p className="text-5xl font-bold font-display text-accent">{totalCharity}</p>
                    <p className="text-xs text-slate-500 mt-2">100 pts = $1 to charity</p>
                </div>
            </div>

            <div className="flex justify-center mb-12">
               <button onClick={markWorkoutComplete} className="btn-primary py-3 px-8 text-lg bg-emerald-500 hover:bg-emerald-400">
                    + Log Workout for Today
               </button>
            </div>

            {/* Timeline */}
            <h3 className="text-2xl font-bold mb-6 text-slate-200">Recent Activity</h3>
            <div className="space-y-4">
                {progress.length === 0 ? (
                    <p className="text-slate-400 text-center py-10 card">No progress logs yet. Start working out to earn points!</p>
                ) : (
                    progress.map((log, i) => (
                        <div key={i} className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                            <div className={`w-3 h-3 rounded-full ${log.workout_completed ? 'bg-primary' : 'bg-slate-600'}`}></div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-200">{new Date(log.date).toLocaleDateString()}</p>
                                <p className="text-sm text-slate-400">
                                    {log.workout_completed ? 'Workout Completed! 🏋️‍♀️' : 'No workout logged.'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-secondary font-medium">{log.calories_burned} kcal</p>
                                <p className="text-sm text-accent">+{log.charity_points} points</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Progress;
