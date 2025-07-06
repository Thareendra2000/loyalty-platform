import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { redeemPoints, getBalance, handleApiError } from '../api/loyaltyApi';
import type { RedeemPointsRequest } from '../api/loyaltyApi';

const RedeemPoints: React.FC = () => {
  const [formData, setFormData] = useState<RedeemPointsRequest>({
    points: 0,
    description: '',
  });
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetchingBalance, setFetchingBalance] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setFetchingBalance(true);
      const response = await getBalance();
      setBalance(response.data.balance);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Balance fetch error:', err);
    } finally {
      setFetchingBalance(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.points > balance) {
      setError('Insufficient points balance');
      setLoading(false);
      return;
    }

    try {
      await redeemPoints(formData);
      setSuccess(`Successfully redeemed ${formData.points} points!`);
      setFormData({ points: 0, description: '' });
      
      // Refresh balance
      await fetchBalance();
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Redeem points error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 0 : value
    }));
  };

  const rewardOptions = [
    { name: '$5 Gift Card', points: 500, description: 'Digital gift card for popular stores' },
    { name: '$10 Gift Card', points: 1000, description: 'Digital gift card for popular stores' },
    { name: '$25 Gift Card', points: 2500, description: 'Digital gift card for popular stores' },
    { name: 'Free Coffee', points: 100, description: 'Complimentary coffee at partner locations' },
    { name: 'Free Lunch', points: 250, description: 'Complimentary meal at partner restaurants' },
    { name: 'Premium Membership', points: 1500, description: '1-month premium membership upgrade' },
  ];

  const handleRewardSelect = (reward: { name: string; points: number; description: string }) => {
    setFormData({
      points: reward.points,
      description: reward.name
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Redeem Points</h1>
        <p className="mt-2 text-gray-600">Use your loyalty points to claim rewards</p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Available Balance:</span> {' '}
            {fetchingBalance ? 'Loading...' : `${balance.toLocaleString()} points`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reward Options */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Available Rewards</h3>
            <p className="text-sm text-gray-600">Select a reward to redeem your points</p>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {rewardOptions.map((reward, index) => (
                <button
                  key={index}
                  onClick={() => handleRewardSelect(reward)}
                  disabled={balance < reward.points}
                  className={`w-full text-left p-4 border rounded-lg transition-colors ${
                    balance < reward.points
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{reward.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                      {balance < reward.points && (
                        <p className="text-xs text-red-600 mt-1">
                          Need {reward.points - balance} more points
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-lg font-bold text-red-600">{reward.points}</span>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Redemption Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Custom Redemption</h3>
            <p className="text-sm text-gray-600">Redeem a specific amount of points</p>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                  Points to Redeem
                </label>
                <input
                  type="number"
                  id="points"
                  name="points"
                  min="1"
                  max={balance}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.points || ''}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum: {balance.toLocaleString()} points
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Redemption Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What are you redeeming points for?"
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
                  disabled={loading || formData.points > balance}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Redeeming...' : 'Redeem Points'}
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

export default RedeemPoints;
