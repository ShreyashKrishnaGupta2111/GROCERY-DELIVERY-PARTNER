import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/Common/CartDrawer';
import Toast from './components/Common/Toast';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <LocationProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-radial-gradient dark:bg-zinc-950 transition-colors">
          {/* Header Navigation */}
          <Navbar />

          {/* Main App Routes */}
          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Footer Navigation */}
          <Footer />

          {/* Global Cart Drawer Overlay */}
          <CartDrawer />

          {/* Toast Notification Container */}
          <Toast />
        </div>
      </Router>
    </LocationProvider>
  );
}
