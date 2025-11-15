import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import ProfilePage from './pages/ProfilePage';
import InvestmentsPage from './pages/InvestmentsPage';
import ProtectedRoute from './components/ProtectedRoute';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/profile`,
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email"
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/investments" element={<InvestmentsPage />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;

