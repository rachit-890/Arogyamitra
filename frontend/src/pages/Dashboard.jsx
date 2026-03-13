import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, progressRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/progress')
        ]);
        setProfile(profileRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        if(err.response?.status === 404) {
           navigate('/profile-setup');
        }
      }
    };
    fetchData();
  }, [navigate]);

  if (!profile) return <div className="text-center mt-20 text-xl text-slate-400">Loading Dashboard...</div>;

  const todayProgress = progress.length > 0 && new Date(progress[0].date).toDateString() === new Date().toDateString() 
        ? progress[0] : { calories_burned: 0, workout_completed: false, charity_points: 0 };

  return (
    <div className="space-y-8 animate-fade-in">
        <header className="flex justify-between items-center bg-gradient-to-r from-darkCard to-slate-800 p-8 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div>
                <h1 className="text-4xl font-display font-bold mb-2">Hello, Arogya Warrior <span className="text-3xl">👋</span></h1>
                <p className="text-slate-400">Your goal: <span className="text-emerald-400 font-medium">{profile.fitness_goal}</span></p>
            </div>
            <div className="text-right glass p-4 rounded-xl">
                <p className="text-sm text-slate-400 font-medium">Charity Points</p>
                <p className="text-3xl font-bold text-accent">{todayProgress.charity_points}</p>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => navigate('/workout')}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Today's Workout</h3>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">💪</div>
                </div>
                <p className="text-slate-400 mb-4">{todayProgress.workout_completed ? "Completed! Awesome job." : "Get moving! View your plan."}</p>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-primary transition-all duration-1000 ${todayProgress.workout_completed ? 'w-full' : 'w-0'}`}></div>
                </div>
            </div>
            
            <div className="card hover:border-secondary/50 transition-colors group cursor-pointer" onClick={() => navigate('/nutrition')}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Nutrition Plan</h3>
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">🥗</div>
                </div>
                <p className="text-slate-400">Following: <span className="text-slate-200">{profile.diet_preference}</span></p>
                <p className="text-sm mt-2 text-slate-500">View today's meals &rarr;</p>
            </div>

            <div className="card hover:border-accent/50 transition-colors group cursor-pointer" onClick={() => navigate('/chat')}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">AROMI AI Coach</h3>
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">🤖</div>
                </div>
                <p className="text-slate-400 text-sm mb-4">Feeling sore? Traveling? Chat directly to dynamically adjust your plan.</p>
                <button className="text-accent font-medium hover:underline text-sm">Start Chat</button>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
