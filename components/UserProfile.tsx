
import React, { useState } from 'react';
import { UserProfileData } from '../types';
import Card from './common/Card';

interface UserProfileProps {
    userProfile: UserProfileData;
    onUpdate: (profile: UserProfileData) => void;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const UserProfile: React.FC<UserProfileProps> = ({ userProfile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfileData>(userProfile);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value }));
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    return (
        <Card title="Your Profile" icon={<UserIcon />}>
            {!isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>Age:</strong> {userProfile.age}</div>
                        <div><strong>Height:</strong> {userProfile.height} cm</div>
                        <div><strong>Weight:</strong> {userProfile.weight} kg</div>
                        <div><strong>Gender:</strong> {userProfile.gender}</div>
                        <div><strong>Activity:</strong> {userProfile.activityLevel.replace('_', ' ')}</div>
                        <div><strong>Goal:</strong> {userProfile.goal.replace('_', ' ')}</div>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                    >
                        Edit Profile
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(formData).map((key) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                {key === 'gender' || key === 'activityLevel' || key === 'goal' || key === 'preferences' ? (
                                    <select name={key} value={formData[key as keyof UserProfileData] as string} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                        {key === 'gender' && <><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></>}
                                        {key === 'activityLevel' && <><option value="sedentary">Sedentary</option><option value="lightly_active">Lightly Active</option><option value="moderately_active">Moderately Active</option><option value="very_active">Very Active</option></>}
                                        {key === 'goal' && <><option value="fat_loss">Fat Loss</option><option value="muscle_gain">Muscle Gain</option><option value="maintenance">Maintenance</option></>}
                                        {key === 'preferences' && <><option value="veg">Veg</option><option value="non-veg">Non-Veg</option></>}
                                    </select>
                                ) : (
                                    <input
                                        type={typeof formData[key as keyof UserProfileData] === 'number' ? 'number' : 'text'}
                                        name={key}
                                        value={formData[key as keyof UserProfileData]}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary">Save</button>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300">Cancel</button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default UserProfile;
