import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { userAPI, leaderboardAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Settings, DollarSign } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appTimeHistory, setAppTimeHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [graphMode, setGraphMode] = useState('time'); // 'time' or 'amount'
  const [compareWith, setCompareWith] = useState('you');
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, appTimeRes, leaderboardRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getAppTime(7),
        leaderboardAPI.getLeaderboard(),
      ]);

      setProfile(profileRes.data);
      setAppTimeHistory(appTimeRes.data.history);
      setLeaderboard(leaderboardRes.data.leaderboard);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const processGraphData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dataMap = {};
    
    // Initialize all days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      dataMap[dayKey] = {
        date: days[date.getDay()],
        fullDate: dayKey,
        you: 0,
        leader: 0,
        average: 0,
      };
    }

    // Process user's data
    appTimeHistory.forEach(entry => {
      const dayKey = entry.date;
      if (dataMap[dayKey]) {
        if (graphMode === 'time') {
          dataMap[dayKey].you += entry.time_spent_hours;
        } else {
          dataMap[dayKey].you += entry.amount_charged;
        }
      }
    });

    // Process leaderboard data for comparison
    if (compareWith === 'leader' && leaderboard.length > 0) {
      const leader = leaderboard[0];
      // In a real app, you'd fetch leader's history
      // For now, we'll use their weekly average
      const avgDaily = leader.targeted_apps_time_weekly / 7;
      Object.keys(dataMap).forEach(key => {
        dataMap[key].leader = graphMode === 'time' ? avgDaily : (avgDaily * 2);
      });
    }

    // Calculate group average
    const groupAvg = leaderboard.reduce((sum, u) => sum + u.targeted_apps_time_weekly, 0) / leaderboard.length;
    const avgDaily = groupAvg / 7;
    Object.keys(dataMap).forEach(key => {
      dataMap[key].average = graphMode === 'time' ? avgDaily : (avgDaily * 2);
    });

    return Object.values(dataMap);
  };

  const getAppBreakdown = () => {
    const breakdown = {};
    appTimeHistory.forEach(entry => {
      if (!breakdown[entry.app_name]) {
        breakdown[entry.app_name] = 0;
      }
      breakdown[entry.app_name] += entry.time_spent_hours;
    });
    return breakdown;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  const graphData = processGraphData();
  const appBreakdown = getAppBreakdown();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.pfp || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">
                    {profile.leaderboard_position === 1 ? '🥇' : 
                     profile.leaderboard_position === 2 ? '🥈' : 
                     profile.leaderboard_position === 3 ? '🥉' : '🏅'}
                  </span>
                  <span className="text-gray-600">
                    #{profile.leaderboard_position || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAppsModal(true)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Tracked Apps
              </button>
              <button
                onClick={() => navigate('/investments')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                View Investments
              </button>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">
              {profile.name} - {profile.targeted_apps_time_weekly.toFixed(1)} hours
            </h2>
            <p className="text-xl opacity-90 mb-4">on tracked apps this week</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {profile.tracked_apps?.map((app, idx) => (
                <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {app}
                </span>
              ))}
            </div>
            <p className="text-lg opacity-80">
              Amount charged this week: £{profile.amount_charged_weekly.toFixed(2)}
            </p>
          </div>
        </div>

        {/* App Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">App Breakdown</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(appBreakdown).map(([app, hours]) => (
              <div key={app} className="flex-1 min-w-[150px]">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{app}</span>
                  <span className="text-gray-600">{hours.toFixed(1)}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(hours / profile.targeted_apps_time_weekly) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-xl font-semibold">Weekly Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setGraphMode('time')}
                className={`px-4 py-2 rounded-lg ${
                  graphMode === 'time'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                App Screen Time
              </button>
              <button
                onClick={() => setGraphMode('amount')}
                className={`px-4 py-2 rounded-lg ${
                  graphMode === 'amount'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Amount Invested
              </button>
            </div>
          </div>
          <div className="mb-4">
            <select
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="you">You</option>
              <option value="leader">Leader</option>
              <option value="average">Team Average</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="you"
                stroke="#3b82f6"
                strokeWidth={2}
                name="You"
              />
              {compareWith === 'leader' && (
                <Line
                  type="monotone"
                  dataKey="leader"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Leader"
                />
              )}
              {compareWith === 'average' && (
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Average"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Leaderboard
            </h3>
          </div>
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.user_id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  entry.user_id === profile.user_id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  if (entry.user_id !== profile.user_id) {
                    setCompareWith(entry.user_id);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold w-12 text-center">
                    {entry.leaderboard_position}
                  </div>
                  <img
                    src={entry.pfp || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}`}
                    alt={entry.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{entry.name}</div>
                    <div className="text-sm text-gray-600">
                      {entry.targeted_apps_time_weekly.toFixed(1)}h • £{entry.amount_charged_weekly.toFixed(2)}/week
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {entry.tracked_apps?.slice(0, 3).map((app, appIdx) => (
                      <span key={appIdx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apps Modal */}
        {showAppsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Tracked Apps</h3>
              <div className="space-y-2 mb-4">
                {profile.tracked_apps?.map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{app}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAppsModal(false)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

