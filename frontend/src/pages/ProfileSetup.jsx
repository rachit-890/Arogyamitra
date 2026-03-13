import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProfileSetup = () => {
  const [profile, setProfile] = useState({
    age: '', weight_kg: '', height_cm: '',
    fitness_goal: 'Weight Loss', allergies: '', medical_history: '',
    workout_preference: 'Home Workouts', diet_preference: 'Vegetarian'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to load existing profile
    api.get('/users/profile').then(res => {
      if(res.data) setProfile(res.data);
    }).catch(() => console.log("No existing profile found."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', profile);
      navigate('/');
    } catch (err) {
      alert("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-display font-bold mb-8 text-primary">Health Profile Setup</h2>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input type="number" required value={profile.age} onChange={e=>setProfile({...profile, age: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight (kg)</label>
            <input type="number" required value={profile.weight_kg} onChange={e=>setProfile({...profile, weight_kg: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Height (cm)</label>
            <input type="number" required value={profile.height_cm} onChange={e=>setProfile({...profile, height_cm: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fitness Goal</label>
            <select value={profile.fitness_goal} onChange={e=>setProfile({...profile, fitness_goal: e.target.value})} className="input-field bg-slate-900 border-slate-700">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Maintenance</option>
              <option>General Fitness</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Workout Preference</label>
            <select value={profile.workout_preference} onChange={e=>setProfile({...profile, workout_preference: e.target.value})} className="input-field">
              <option>Home Workouts</option>
              <option>Gym</option>
              <option>Street Calisthenics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Diet Preference</label>
            <select value={profile.diet_preference} onChange={e=>setProfile({...profile, diet_preference: e.target.value})} className="input-field">
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Vegan</option>
              <option>Keto</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Allergies (comma separated)</label>
            <input type="text" value={profile.allergies} onChange={e=>setProfile({...profile, allergies: e.target.value})} className="input-field" placeholder="e.g., Peanuts, Lactose" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Medical History (Optional)</label>
            <textarea value={profile.medical_history} onChange={e=>setProfile({...profile, medical_history: e.target.value})} className="input-field h-24" placeholder="e.g., Asthma, previous knee injury" />
          </div>
        </div>
        <div className="pt-4">
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Saving..." : "Save Profile & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;
