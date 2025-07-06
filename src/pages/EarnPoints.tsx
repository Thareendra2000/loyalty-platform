import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { earnPoints, handleApiError } from '../api/loyaltyApi';
import type { EarnPointsRequest } from '../api/loyaltyApi';

const EarnPoints: React.FC = () => {
  const [formData, setFormData] = useState<EarnPointsRequest>({
    points: 0,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await earnPoints(formData);
      setSuccess(`Successfully earned ${formData.points} points!`);
      setFormData({ points: 0, description: '' });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Earn points error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseFloat(value) || 0 : value
    }));
  };

  const predefinedActivities = [
    { name: 'Daily Check-in', points: 10 },
    { name: 'Complete Survey', points: 25 },
    { name: 'Refer a Friend', points: 100 },
    { name: 'Social Media Share', points: 15 },
    { name: 'Product Review', points: 50 },
    { name: 'Newsletter Signup', points: 20 },
  ];

  const handlePredefinedActivity = (activity: { name: string; points: number }) => {
    setFormData({
      points: activity.points,
      description: activity.name
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Earn Points</h1>
        <p className="mt-2 text-gray-600">Complete activities to earn loyalty points</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Activities</h3>
            <p className="text-sm text-gray-600">Click on any activity to earn points</p>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {predefinedActivities.map((activity, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedActivity(activity)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.name}</h4>
                      <p className="text-sm text-gray-600">Complete this activity</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">+{activity.points}</span>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Points Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Custom Activity</h3>
            <p className="text-sm text-gray-600">Manually add points for custom activities</p>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                  Points Amount
                </label>
                <input
                  type="number"
                  id="points"
                  name="points"
                  min="1"
                  max="1000"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.points || ''}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Activity Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the activity you completed..."
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Earning Points...' : 'Earn Points'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnPoints;
