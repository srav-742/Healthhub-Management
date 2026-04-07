import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupportBot from './common/SupportBot';

const HomePage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const heroImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  const animationStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

    * { box-sizing: border-box; }

    .homepage-container {
      position: relative;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      color: #333;
      font-family: 'Outfit', sans-serif;
      backgroundColor: #050a1f;
      display: flex;
      flex-direction: column;
    }

    @keyframes float {
      from { transform: translate(0, 0); }
      to { transform: translate(20px, 20px); }
    }

    .main-grid {
      position: relative;
      z-index: 2;
      flex: 1;
      display: grid;
      grid-template-columns: 45% 55%;
      padding: 0 6% 40px 6%;
      align-items: center;
      gap: 60px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .glass-card {
      backgroundColor: rgba(25, 118, 210, 0.08);
      backdropFilter: blur(20px);
      borderRadius: 24px;
      padding: 24px 30px;
      border: 1px solid rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      gap: 24px;
      color: white;
      transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .glass-card:hover {
      background: rgba(25, 118, 210, 0.15) !important;
      border-color: rgba(255,255,255,0.3) !important;
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 30px 60px rgba(0,0,0,0.3), 0 0 20px rgba(25, 118, 210, 0.3) !important;
    }
    
    .icon-box {
      background: rgba(21, 101, 192, 0.4);
      width: 64px; height: 64px;
      border-radius: 18px;
      display: flex; justify-content: center; align-items: center;
      flex-shrink: 0; color: white;
      transition: transform 0.5s ease;
    }

    .glass-card:hover .icon-box {
      transform: scale(1.1) rotate(-5deg);
      background: #1976d2 !important;
    }

    .btn-main {
      padding: 16px 32px;
      font-weight: 800;
      color: white;
      background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
      border: none;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.4s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-main:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(13, 71, 161, 0.5) !important;
      filter: brightness(1.1);
    }

    .btn-outline {
      padding: 12px 24px;
      background: transparent;
      border: 2px solid rgba(255,255,255,0.3);
      color: white;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-outline:hover {
      background: rgba(255,255,255,0.1) !important;
      border-color: white !important;
      transform: translateY(-2px);
    }

    .step-item {
      position: relative;
      background: rgba(255,255,255,0.03);
      padding: 20px;
      border-radius: 20px;
      border: 1px dashed rgba(255,255,255,0.1);
      transition: all 0.4s ease;
    }
    
    .step-item:hover {
      border-style: solid;
      border-color: rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.06);
    }

    .grid-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      z-index: 1;
      pointer-events: none;
    }

    /* 📱 MOBILE RESPONSIVENESS */
    @media (max-width: 1024px) {
      .homepage-container { height: auto; overflow-y: auto; overflow-x: hidden; }
      .main-grid { 
        grid-template-columns: 1fr; 
        padding: 40px 5%; 
        gap: 40px; 
        text-align: center;
      }
      .main-title { font-size: 3.5rem !important; margin: 0 auto 20px !important; }
      .sub-title { font-size: 1.1rem !important; margin: 0 auto 30px !important; }
      .stats-grid { grid-template-columns: 1fr; }
      .phase-row { flex-direction: column; gap: 15px !important; }
      header { padding: 20px 5% !important; flex-direction: column; gap: 20px; }
      .btn-main { width: 100%; }
      .header-actions { width: 100%; justify-content: center; }
    }
  `;

  // Icons
  const IconCalendar = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const IconRecords = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const IconTeam = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const IconUser = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  );

  const animatedCircleStyle = (size, top, left, delay) => ({
    position: 'absolute',
    width: size, height: size, top, left,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(25, 118, 210, 0.2) 0%, rgba(25, 118, 210, 0) 70%)',
    zIndex: 1, filter: 'blur(40px)',
    animation: `float ${10 + delay}s infinite alternate ease-in-out`,
  });

  return (
    <div className="homepage-container">
      <style>{animationStyles}</style>

      {/* Background elements */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.3) contrast(1.1)', zIndex: 0,
        transform: loaded ? 'scale(1.05)' : 'scale(1.2)', transition: 'transform 10s ease-out',
      }}></div>

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(135deg, rgba(8, 32, 82, 0.95) 0%, rgba(13, 71, 161, 0.8) 50%, rgba(21, 101, 192, 0.6) 100%)',
        zIndex: 1
      }}></div>

      <div className="grid-overlay"></div>
      <div style={animatedCircleStyle('400px', '-100px', '-100px', 0)}></div>
      <div style={animatedCircleStyle('300px', '40%', '80%', 2)}></div>

      <header style={{ position: 'relative', zIndex: 10, padding: '30px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ filter: 'drop-shadow(0 0 10px #1976d2)' }}>☤</span>
          <span style={{ background: 'linear-gradient(to right, #fff, #90caf9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HealthHub</span>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '20px' }}>
          <button className="btn-outline" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-main" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </header>

      <main className="main-grid">
        <div style={{ opacity: loaded ? 1 : 0, transition: 'all 1s ease', transform: loaded ? 'none' : 'translateX(-50px)', color: 'white' }}>
          <h1 className="main-title" style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, margin: '0 0 20px' }}>Healthcare<br />Refined.</h1>
          <p className="sub-title" style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '550px', marginBottom: '40px', lineHeight: 1.6 }}>
            Empowering clinics and patients with an elite digital ecosystem. Seamless coordination, industrial-grade security, and precision management.
          </p>
          <button className="btn-main" style={{ padding: '20px 60px' }} onClick={() => navigate('/signup')}>
            Get Started for Free
          </button>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transition: 'all 1s ease 0.3s', transform: loaded ? 'none' : 'translateX(50px)' }}>
          <h2 style={{ color: '#90caf9', fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Core Capabilities</h2>
          <div className="stats-grid">
            <div className="glass-card"><div className="icon-box"><IconCalendar /></div><div><h3>Smart Scheduling</h3><p style={{ opacity: 0.6 }}>AI-driven appointments</p></div></div>
            <div className="glass-card"><div className="icon-box"><IconRecords /></div><div><h3>E-Records</h3><p style={{ opacity: 0.6 }}>E2E Encrypted History</p></div></div>
            <div className="glass-card"><div className="icon-box"><IconTeam /></div><div><h3>Pro Collaboration</h3><p style={{ opacity: 0.6 }}>Multi-Doctor Consultation</p></div></div>
            <div className="glass-card"><div className="icon-box"><IconUser /></div><div><h3>Digital Care</h3><p style={{ opacity: 0.6 }}>Real-time prescriptions</p></div></div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#90caf9', fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Onboarding Phase</h2>
            <div className="phase-row" style={{ display: 'flex', gap: '20px' }}>
              <div className="step-item"><span style={{ fontSize: '0.7rem', color: '#90caf9', fontWeight: 900 }}>PHASE 01</span><h3 style={{ color: 'white', margin: 0 }}>Profile</h3></div>
              <div className="step-item"><span style={{ fontSize: '0.7rem', color: '#90caf9', fontWeight: 900 }}>PHASE 02</span><h3 style={{ color: 'white', margin: 0 }}>Booking</h3></div>
              <div className="step-item"><span style={{ fontSize: '0.7rem', color: '#90caf9', fontWeight: 900 }}>PHASE 03</span><h3 style={{ color: 'white', margin: 0 }}>Recovery</h3></div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ position: 'relative', zIndex: 10, padding: '20px 6%', textAlign: 'center', color: 'gray', fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.4)' }}>
        © {new Date().getFullYear()} HEALTHHUB ECOSYSTEM. THE FUTURE OF HEALTHCARE.
      </footer>

      <SupportBot />
    </div>
  );
};

export default HomePage;