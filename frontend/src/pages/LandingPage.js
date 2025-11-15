import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

const LandingPage = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await authAPI.login({
            email: user.email,
            name: user.name,
            user_id: user.sub,
            picture: user.picture,
          });
          
          // Check if user needs onboarding
          try {
            const { userAPI } = await import('../services/api');
            const profileRes = await userAPI.getProfile();
            if (!profileRes.data.tracked_apps || profileRes.data.tracked_apps.length === 0) {
              navigate('/onboarding');
            } else {
              navigate('/profile');
            }
          } catch (profileError) {
            // If profile fetch fails, user might be new, go to onboarding
            navigate('/onboarding');
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
    };
    handleAuth();
  }, [isAuthenticated, user, navigate]);

  const handleSignUp = () => {
    loginWithRedirect({
      screen_hint: 'signup',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Stop Scrolling, Start Investing
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Track time on apps that matter
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Instagram, TikTok, YouTube & more
          </p>

          <button
            onClick={handleSignUp}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg transform transition hover:scale-105 mb-16"
          >
            Sign up with Google
          </button>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Screen Time</h3>
              <p className="text-gray-600">
                Monitor time spent on social media and entertainment apps
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Auto-Invest</h3>
              <p className="text-gray-600">
                Get charged £2/hour and watch your money grow automatically
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Compete & Compare</h3>
              <p className="text-gray-600">
                See how you stack up on the leaderboard
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600 mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Select Apps to Track</h4>
                  <p className="text-gray-600">
                    Choose which apps you want to monitor during onboarding
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600 mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Connect Screen Time</h4>
                  <p className="text-gray-600">
                    Link your device's screen time data (manual input available)
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600 mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Get Charged & Invest</h4>
                  <p className="text-gray-600">
                    £2 per hour on tracked apps is automatically invested based on your risk preference
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-8 text-white">
            <TrendingUp className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Turn Scrolling Into Savings</h2>
            <p className="text-xl opacity-90">
              Every hour you spend scrolling becomes an investment in your future
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

