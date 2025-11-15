import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { investmentsAPI, userAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, ArrowLeft } from 'lucide-react';

const RISK_LEVELS = {
  standard: {
    name: 'Standard - General Savings',
    allocation: { Bonds: 60, ETFs: 40 },
    color: '#3b82f6',
  },
  low: {
    name: 'Low Risk',
    allocation: { Bonds: 80, ETFs: 20 },
    color: '#10b981',
  },
  medium: {
    name: 'Medium Risk',
    allocation: { Bonds: 50, ETFs: 50 },
    color: '#f59e0b',
  },
  high: {
    name: 'High Risk',
    allocation: { Bonds: 20, ETFs: 80 },
    color: '#ef4444',
  },
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const InvestmentsPage = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showRiskSelection, setShowRiskSelection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portfolioRes, historyRes, profileRes] = await Promise.all([
        investmentsAPI.getPortfolio(),
        investmentsAPI.getHistory(30),
        userAPI.getProfile(),
      ]);

      setPortfolio(portfolioRes.data);
      setHistory(historyRes.data.history);
      setProfile(profileRes.data);
      
      // Show risk selection if not set
      if (!profileRes.data.investment_risk_level || profileRes.data.investment_risk_level === 'standard') {
        setShowRiskSelection(true);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleRiskSelection = async (riskLevel) => {
    try {
      await investmentsAPI.setupInvestments(riskLevel);
      setShowRiskSelection(false);
      loadData();
    } catch (error) {
      console.error('Error setting risk level:', error);
      alert('Error saving risk level. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showRiskSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/profile')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Investment Strategy</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(RISK_LEVELS).map(([key, level]) => (
              <div
                key={key}
                onClick={() => handleRiskSelection(key)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
              >
                <h3 className="text-2xl font-bold mb-2">{level.name}</h3>
                <div className="space-y-2 mb-4">
                  {Object.entries(level.allocation).map(([asset, percent]) => (
                    <div key={asset} className="flex items-center justify-between">
                      <span className="text-gray-600">{asset}</span>
                      <span className="font-semibold">{percent}%</span>
                    </div>
                  ))}
                </div>
                {key === 'standard' && (
                  <p className="text-sm text-gray-500">6min/week conscious</p>
                )}
                {key === 'low' && (
                  <p className="text-sm text-gray-500">Stable, predictable returns</p>
                )}
                {key === 'medium' && (
                  <p className="text-sm text-gray-500">Balanced growth and stability</p>
                )}
                {key === 'high' && (
                  <p className="text-sm text-gray-500">Maximum growth potential, higher volatility</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const riskLevel = portfolio?.risk_level || 'standard';
  const riskConfig = RISK_LEVELS[riskLevel] || RISK_LEVELS.standard;
  
  const pieData = Object.entries(riskConfig.allocation).map(([name, value]) => ({
    name,
    value,
  }));

  const chartData = history.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: entry.portfolio_value,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Profile
        </button>

        {/* Top Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Total Investment Value</h2>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold">
                  £{portfolio?.total_value?.toFixed(2) || '0.00'}
                </span>
                {portfolio?.change_24h !== undefined && (
                  <div className={`flex items-center gap-1 ${portfolio.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolio.change_24h >= 0 ? (
                      <ArrowUp className="w-6 h-6" />
                    ) : (
                      <ArrowDown className="w-6 h-6" />
                    )}
                    <span className="text-2xl font-semibold">
                      {Math.abs(portfolio.change_24h).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 mt-2">
                Last 24h
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Funded by</p>
              <p className="text-2xl font-semibold">
                {profile?.targeted_apps_time_weekly?.toFixed(1) || 0} hours
              </p>
              <p className="text-sm text-gray-500">on tracked apps</p>
            </div>
          </div>
        </div>

        {/* Portfolio Graph */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Portfolio Performance (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`£${value.toFixed(2)}`, 'Portfolio Value']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={riskConfig.color}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Portfolio Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Holdings</h3>
            <div className="space-y-4">
              {Object.entries(riskConfig.allocation).map(([asset, percent], idx) => {
                const value = (portfolio?.total_value || 0) * (percent / 100);
                return (
                  <div key={asset} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{asset}</div>
                      <div className="text-sm text-gray-600">{percent}% allocation</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">£{value.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Current value</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className="font-semibold">{riskConfig.name}</span>
              </div>
              <button
                onClick={() => setShowRiskSelection(true)}
                className="mt-4 w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Change Risk Level
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage;

