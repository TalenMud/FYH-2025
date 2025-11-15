import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProfilePage = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [userRank] = useState(3);
  const [comparedUsers, setComparedUsers] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const mockLeaderboard = [
    { position: 1, name: 'Sarah Chen', time: '2h 45m', invested: '£10.50', data: [2.5, 3, 1.5, 2, 4, 1, 2] },
    { position: 2, name: 'Mike Lee', time: '4h 10m', invested: '£12.80', data: [3.5, 4, 2.5, 3.5, 4.5, 2, 3] },
    { position: 3, name: 'Alex Johnson', time: '5h 12m', invested: '£14.10', data: [3.5, 4, 2, 3, 5, 1.5, 2.5], isUser: true },
    { position: 4, name: 'Emily Rodriguez', time: '5h 45m', invested: '£15.00', data: [4, 4.5, 3, 4, 5.5, 2, 3.5] },
    { position: 5, name: 'David Kim', time: '6h 2m', invested: '£18.20', data: [4.5, 5, 3.5, 4.5, 6, 2.5, 4] },
    { position: 6, name: 'Jessica Brown', time: '7h 30m', invested: '£22.50', data: [5, 5.5, 4, 5, 6.5, 3, 4.5] },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const userScrollData = [3.5, 4, 2, 3, 5, 1.5, 2.5];
  const groupAverageData = [3, 3, 3, 3, 3, 3, 3];

  useEffect(() => {
    // Initialize graph data
    const baseData = days.map((day, i) => ({
      name: day,
      'Your Time': userScrollData[i],
      'Group Average': groupAverageData[i],
    }));
    setGraphData(baseData);
  }, []);

  useEffect(() => {
    // Update graph when compared users change
    const updatedData = days.map((day, i) => {
      const dataPoint = {
        name: day,
        'Your Time': userScrollData[i],
        'Group Average': groupAverageData[i],
      };
      
      comparedUsers.forEach(userName => {
        const user = mockLeaderboard.find(u => u.name === userName);
        if (user) {
          dataPoint[userName] = user.data[i];
        }
      });
      
      return dataPoint;
    });
    setGraphData(updatedData);
  }, [comparedUsers]);

  const toggleCompare = (userName) => {
    setComparedUsers(prev => 
      prev.includes(userName) 
        ? prev.filter(u => u !== userName)
        : [...prev, userName]
    );
  };

  const getRankMedalColor = (rank) => {
    if (rank === 1) return 'bg-yellow-400';
    if (rank === 2) return isDark ? 'bg-gray-400' : 'bg-gray-500';
    if (rank === 3) return 'bg-orange-400';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Theme toggle
  useEffect(() => {
    const prefersDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = (dark) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4 transition-colors duration-300">
        
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 flex space-x-2 z-10">
          <button
            onClick={() => toggleTheme(false)}
            className={`p-2 rounded-full ${!isDark ? 'text-green-500' : 'text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button
            onClick={() => toggleTheme(true)}
            className={`p-2 rounded-full ${isDark ? 'text-green-500' : 'text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md mx-auto pt-16">
          
          {/* Header: Rank, Profile Pic, Button */}
          <div className="flex items-center justify-between mb-6">
            {/* Top Left: Leaderboard Rank */}
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-full shadow-md ${getRankMedalColor(userRank)}`}></div>
              <span className="text-xl font-black text-gray-900 dark:text-white">{getOrdinal(userRank)}</span>
            </div>
            
            {/* Top Center: Profile Picture */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <img 
                src={user?.picture || `https://placehold.co/100x100/a7f3d0/14532d?text=${(user?.name || 'User').charAt(0).toUpperCase()}`}
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-green-500 dark:border-green-400 shadow-lg"
              />
            </div>
            
            {/* Top Right: View Investments Button */}
            <button
              onClick={() => navigate('/investments')}
              className="bg-green-500 dark:bg-green-400 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-green-600 dark:hover:bg-green-500 transition-colors duration-300"
            >
              View Investments
            </button>
          </div>

          {/* User Info */}
          <div className="text-center mb-8 pt-12">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">{user?.name || 'Test User'}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              <span className="text-green-500 dark:text-green-400 font-bold">5h 12m</span> spent doomscrolling this week
            </p>
          </div>

          {/* Graph */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" style={{ boxShadow: isDark ? '0 0 10px rgba(74, 222, 128, 0.4)' : '0 0 10px rgba(34, 197, 94, 0.3)' }}>
            <h2 className="text-xl font-black mb-4 text-center text-gray-900 dark:text-white">Your Weekly Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                <XAxis dataKey="name" stroke={isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'} />
                <YAxis stroke={isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: '1px solid #d1d5db' }} />
                <Legend />
                <Line type="monotone" dataKey="Your Time" stroke={isDark ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)'} strokeWidth={2} />
                <Line type="monotone" dataKey="Group Average" stroke={isDark ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)'} strokeWidth={2} strokeDasharray="5 5" />
                {comparedUsers.map((userName, idx) => (
                  <Line key={userName} type="monotone" dataKey={userName} strokeWidth={2} strokeDasharray="8 4" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Leaderboard */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" style={{ boxShadow: isDark ? '0 0 10px rgba(74, 222, 128, 0.4)' : '0 0 10px rgba(34, 197, 94, 0.3)' }}>
            <h2 className="text-xl font-black mb-4 text-center text-gray-900 dark:text-white">Leaderboard</h2>
            
            {/* Scrollable Table */}
            <div className="overflow-y-auto max-h-60 pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: isDark ? '#4ade80 #1f2937' : '#a7f3d0 #f3f4f6' }}>
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-2 text-xs font-bold text-gray-600 dark:text-gray-400">Pos</th>
                    <th className="py-2 text-xs font-bold text-gray-600 dark:text-gray-400">Name</th>
                    <th className="py-2 text-xs font-bold text-gray-600 dark:text-gray-400">Time</th>
                    <th className="py-2 text-xs font-bold text-gray-600 dark:text-gray-400 text-right">Invested</th>
                    <th className="py-2 text-xs font-bold text-gray-600 dark:text-gray-400 text-center">Compare</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900 dark:text-white">
                  {mockLeaderboard.map((entry) => (
                    <tr key={entry.position} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 font-bold">
                        {entry.position === 1 && <span className="text-yellow-400">1st</span>}
                        {entry.position === 2 && <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>2nd</span>}
                        {entry.position === 3 && <span className="text-orange-400">3rd</span>}
                        {entry.position > 3 && <span className="text-gray-600 dark:text-gray-400">{entry.position}th</span>}
                      </td>
                      <td className="py-3">{entry.name}</td>
                      <td className="py-3">{entry.time}</td>
                      <td className="py-3 text-right">{entry.invested}</td>
                      <td className="py-3 text-center">
                        {entry.isUser ? (
                          <span className="text-gray-500 dark:text-gray-400 font-semibold text-xs">You</span>
                        ) : (
                          <button
                            onClick={() => toggleCompare(entry.name)}
                            className={`text-xs font-semibold transition-colors ${
                              comparedUsers.includes(entry.name)
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-green-500 dark:text-green-400 hover:underline'
                            }`}
                          >
                            {comparedUsers.includes(entry.name) ? 'Remove' : 'Add'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

