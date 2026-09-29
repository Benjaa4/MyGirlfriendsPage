import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Mail, Image as ImageIcon } from 'lucide-react';
import { AdminPanel } from './pages/Admin';
import { HomeView } from './pages/Home';
import { CartasView } from './pages/Cartas';
import { GaleriaView } from './pages/Galeria';
import './index.css';

import { motion } from 'framer-motion';

const AmbientOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div 
        className="absolute top-10 left-[-10%] w-72 h-72 bg-[#6B1D2F] rounded-full mix-blend-multiply filter blur-[100px] opacity-30"
        animate={{ x: [0, 150, -100, 0], y: [0, -150, 120, 0], scale: [1, 1.3, 0.8, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-[-10%] w-96 h-96 bg-[#8B263E] rounded-full mix-blend-multiply filter blur-[120px] opacity-20"
        animate={{ x: [0, -120, 150, 0], y: [0, 100, -150, 0], scale: [1, 0.8, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const NavItem = ({ to, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`relative flex flex-col items-center justify-center p-3 transition-colors ${isActive ? 'text-accent' : 'text-text-main/40 hover:text-text-main/60'}`}
    >
      <Icon size={22} strokeWidth={1.5} />
      {isActive && (
        <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent" />
      )}
    </Link>
  );
};

const BottomNav = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xs rounded-full bg-[#FDFBF7]/40 backdrop-blur-md shadow-sm border border-[#6B1D2F]/10 px-8 py-4 flex justify-between items-center z-50">
      <NavItem to="/" icon={Home} />
      <NavItem to="/cartas" icon={Mail} />
      <NavItem to="/galeria" icon={ImageIcon} />
    </nav>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/panel-privado';

  return (
    <div className={`mx-auto w-full max-w-full sm:max-w-md min-h-screen relative shadow-2xl overflow-x-hidden ${isAdmin ? '' : 'pb-32'}`}>
      <AmbientOrbs />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
      {!isAdmin && <BottomNav />}
    </div>
  );
};

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/cartas" element={<CartasView />} />
        <Route path="/galeria" element={<GaleriaView />} />
        <Route path="/panel-privado" element={<AdminPanel />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
