import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';

const RISK_LEVELS = {
  standard: {
    name: 'Standard (Zero Risk) - General Savings Account',
    allocation: 'General Savings Account',
    short: 'Standard Savings'
  },
  low: {
    name: 'Low Risk - Bonds (100%)',
    allocation: 'Bonds (100%)',
    short: 'Low Risk'
  },
  medium: {
    name: 'Medium Risk - Bonds (50%) / ETF (50%)',
    allocation: 'Bonds (50%) / ETF (50%)',
    short: 'Medium Risk'
  },
  high: {
    name: 'High Risk - ETFs (100%)',
    allocation: 'ETFs (100%)',
    short: 'High Risk'
  },
};

const InvestmentsPage = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [currentRisk, setCurrentRisk] = useState({ type: 'medium', value: 1 });
  const [stagedRisk, setStagedRisk] = useState({ type: 'medium', value: 1 });
  const [showRiskOptions, setShowRiskOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentView, setCurrentView] = useState('D');
  const [selectedRadio, setSelectedRadio] = useState('custom');

  // Sample data matching the original HTML
  const sampleData = {
    D: {
      labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', 'Now'],
      values: [15.02, 15.03, 15.01, 15.00, 14.99, 15.01, 15.00]
    },
    W: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [14.95, 14.96, 14.98, 14.97, 15.00, 15.02, 15.00]
    },
    M: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [14.80, 14.85, 14.92, 15.00]
    },
    Y: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [10.00, 10.50, 11.20, 11.00, 12.00, 12.50, 13.00, 13.50, 14.00, 14.50, 14.80, 15.00]
    }
  };

  const statData = {
    D: { time: "LAST 24H", amount: "-£0.02", percent: "(-0.13%)", isPositive: false },
    W: { time: "LAST WEEK", amount: "+£0.05", percent: "(+0.33%)", isPositive: true },
    M: { time: "LAST MONTH", amount: "+£0.20", percent: "(+1.35%)", isPositive: true },
    Y: { time: "LAST YEAR", amount: "+£5.00", percent: "(+50.00%)", isPositive: true }
  };

  const getRiskLabel = (risk) => {
    if (risk.type === 'standard') return RISK_LEVELS.standard.name;
    const riskKeys = ['low', 'medium', 'high'];
    return RISK_LEVELS[riskKeys[risk.value]].name;
  };

  const chartData = sampleData[currentView].labels.map((label, i) => ({
    name: label,
    value: sampleData[currentView].values[i]
  }));

  const isDifferent = stagedRisk.type !== currentRisk.type || stagedRisk.value !== currentRisk.value;

  const handleUpdateClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    setCurrentRisk({ ...stagedRisk });
    setShowModal(false);
    setShowRiskOptions(false);
  };

  const handleRadioChange = (type) => {
    setSelectedRadio(type);
    if (type === 'standard') {
      setStagedRisk({ type: 'standard', value: 0 });
    } else {
      setStagedRisk({ type: 'custom', value: stagedRisk.value });
    }
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setStagedRisk({ type: 'custom', value });
  };

  useEffect(() => {
    if (showRiskOptions) {
      setStagedRisk({ ...currentRisk });
      setSelectedRadio(currentRisk.type === 'standard' ? 'standard' : 'custom');
    }
  }, [showRiskOptions]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4 transition-colors duration-300">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 flex space-x-2 z-50">
          <button
            onClick={() => setIsDark(false)}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${!isDark ? 'text-green-500' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button
            onClick={() => setIsDark(true)}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-green-500' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md mx-auto pt-16 pb-16">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-3xl font-black">Your Investments</h1>
            <div></div>
          </div>

          {/* Current Risk Display */}
          <div className="w-full text-left px-4 py-3 mb-4 bg-white dark:bg-gray-800 border-2 border-green-500 dark:border-green-400 rounded-xl shadow-lg" style={{ boxShadow: isDark ? '0 0 10px rgba(74, 222, 128, 0.4)' : '0 0 10px rgba(34, 197, 94, 0.3)' }}>
            <span className="font-semibold">{getRiskLabel(currentRisk)}</span>
          </div>

          {/* Change Risk Button */}
          <button
            onClick={() => setShowRiskOptions(!showRiskOptions)}
            className={`w-full flex justify-between items-center text-left text-sm font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-300 mb-4 ${
              showRiskOptions
                ? 'bg-green-500 dark:bg-green-400 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span>Change your risk Level</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showRiskOptions ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showRiskOptions ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Risk Options Box */}
          <div
            className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden ${
              showRiskOptions ? 'p-4 mb-8 opacity-100' : 'p-0 mb-0 opacity-0 h-0'
            }`}
            style={{ boxShadow: showRiskOptions ? (isDark ? '0 0 10px rgba(74, 222, 128, 0.4)' : '0 0 10px rgba(34, 197, 94, 0.3)') : 'none' }}
          >
            <div className="space-y-4">
              {/* Standard Savings */}
              <div className="flex items-center">
                <input
                  id="risk-savings"
                  name="risk-type"
                  type="radio"
                  checked={selectedRadio === 'standard'}
                  onChange={() => handleRadioChange('standard')}
                  className="h-4 w-4"
                  style={{ accentColor: isDark ? '#4ade80' : '#22c55e' }}
                />
                <label htmlFor="risk-savings" className="ml-3 block text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer">
                  Standard (Zero Risk) - General Savings Account
                </label>
              </div>

              {/* Investments */}
              <div className="flex items-center">
                <input
                  id="risk-invest"
                  name="risk-type"
                  type="radio"
                  checked={selectedRadio === 'custom'}
                  onChange={() => handleRadioChange('custom')}
                  className="h-4 w-4"
                  style={{ accentColor: isDark ? '#4ade80' : '#22c55e' }}
                />
                <label htmlFor="risk-invest" className="ml-3 block text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer">
                  Investments (Low Risk - High Risk)
                </label>
              </div>

              {/* Disclaimer */}
              {selectedRadio === 'custom' && (
                <div className="pl-7">
                  <p className="text-xs text-gray-500 dark:text-gray-400">The value of your investments may go up or down.</p>
                </div>
              )}

              {/* Slider */}
              {selectedRadio === 'custom' && (
                <div className="pt-2 pl-7">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                    <div className="relative py-3">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center z-0">
                        <div className="w-1 h-5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                        <div className="w-1 h-5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                        <div className="w-1 h-5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        value={stagedRisk.value}
                        onChange={handleSliderChange}
                        step="1"
                        className="w-full relative z-10 cursor-pointer"
                        style={{
                          background: 'transparent',
                          WebkitAppearance: 'none',
                          appearance: 'none'
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 text-xs font-semibold text-gray-600 dark:text-gray-400 -mx-1">
                      <div className="flex flex-col items-start"><span>Low</span></div>
                      <div className="flex flex-col items-center"><span>Medium</span></div>
                      <div className="flex flex-col items-end"><span>High</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Update Button */}
              <button
                onClick={handleUpdateClick}
                disabled={!isDifferent}
                className={`w-full text-sm font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-300 ${
                  isDifferent
                    ? 'bg-green-500 dark:bg-green-400 text-white hover:bg-green-600 dark:hover:bg-green-500'
                    : 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                }`}
              >
                {isDifferent ? 'Update Risk Profile' : 'Current Risk Level'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-center mb-8 mt-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">VALUE</h3>
              <p className="text-3xl font-black">£15.00</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{statData[currentView].time}</h3>
              <p className={`text-3xl font-black ${statData[currentView].isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {statData[currentView].amount}
              </p>
              <span className={`text-sm font-bold ${statData[currentView].isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {statData[currentView].percent}
              </span>
            </div>
          </div>

          {/* Graph */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" style={{ boxShadow: isDark ? '0 0 10px rgba(74, 222, 128, 0.4)' : '0 0 10px rgba(34, 197, 94, 0.3)' }}>
            {/* Time Toggle */}
            <div className="flex justify-center space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-full mb-4">
              {['D', 'W', 'M', 'Y'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`w-full px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                    currentView === view
                      ? 'bg-white dark:bg-gray-900 shadow'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                <XAxis dataKey="name" stroke={isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'} />
                <YAxis 
                  stroke={isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'} 
                  tickFormatter={(value) => `£${value.toFixed(2)}`}
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                />
                <Tooltip formatter={(value) => `£${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: '1px solid #d1d5db' }} />
                <Line type="monotone" dataKey="value" stroke={isDark ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)'} strokeWidth={2} dot={{ fill: isDark ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-sm p-6 rounded-2xl shadow-lg text-center border border-gray-200 dark:border-gray-700" style={{ boxShadow: isDark ? '0 0 10px rgba(74, 222, 128, 0.4)' : '0 0 10px rgba(34, 197, 94, 0.3)' }}>
              <h3 className="text-xl font-black mb-4">Confirm Risk Change</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                You are about to change your risk profile to:{' '}
                <strong className="text-green-500 dark:text-green-400">{getRiskLabel(stagedRisk)}</strong>.
                This will rebalance your portfolio.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="w-full bg-green-500 dark:bg-green-400 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-green-600 dark:hover:bg-green-500 transition-colors duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
          }

          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #a7f3d0;
            border: 2px solid ${isDark ? '#f0fdf4' : '#14532d'};
            cursor: pointer;
            margin-top: -6px;
            position: relative;
            z-index: 10;
          }

          input[type=range]::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #a7f3d0;
            border: 2px solid ${isDark ? '#f0fdf4' : '#14532d'};
            cursor: pointer;
            position: relative;
            z-index: 10;
          }

          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 8px;
            cursor: pointer;
            border-radius: 10px;
            background: linear-gradient(to right, #fde047, #f97316, #ef4444);
          }

          input[type=range]::-moz-range-track {
            width: 100%;
            height: 8px;
            cursor: pointer;
            border-radius: 10px;
            background: linear-gradient(to right, #fde047, #f97316, #ef4444);
          }
        `}</style>
      </div>
    </div>
  );
};

export default InvestmentsPage;