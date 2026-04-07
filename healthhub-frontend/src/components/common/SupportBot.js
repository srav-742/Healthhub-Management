import React, { useState, useEffect } from 'react';

const faqs = [
    {
        q: "How do I book an appointment?",
        a: "Once you log in as a Patient, navigate to the 'Book Appointment' section, select your doctor, and choose an available time slot."
    },
    {
        q: "Where can I see my prescriptions?",
        a: "All your digital prescriptions are stored securely in the 'Prescriptions' tab of your Patient Dashboard."
    },
    {
        q: "How do I contact support?",
        a: "You can reach our help desk at support@healthhub.com or use the 'Help' section in your dashboard for specific queries."
    },
    {
        q: "Is my medical data secure?",
        a: "Yes, HealthHub uses industry-standard end-to-end encryption to ensure your medical records are only accessible by you and your authorized doctors."
    },
    {
        q: "What if I forget my password?",
        a: "Click on 'Forgot Password' on the login page, and we will send a reset link to your registered email address."
    }
];

const SupportBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeQuery, setActiveQuery] = useState(null);
    const [displayedAnswer, setDisplayedAnswer] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Typing effect logic
    useEffect(() => {
        if (activeQuery !== null) {
            setIsTyping(true);
            setDisplayedAnswer('');
            let index = 0;
            const fullText = faqs[activeQuery].a;

            const interval = setInterval(() => {
                setDisplayedAnswer((prev) => prev + fullText.charAt(index));
                index++;
                if (index >= fullText.length) {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 20); // Speed of typing

            return () => clearInterval(interval);
        }
    }, [activeQuery]);

    const handleQueryClick = (index) => {
        if (activeQuery === index) {
            setActiveQuery(null);
            setDisplayedAnswer('');
        } else {
            setActiveQuery(index);
        }
    };

    const animationStyles = `
    .bot-pulse {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(13, 71, 161, 0.4); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(13, 71, 161, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(13, 71, 161, 0); }
    }
    .query-item {
      padding: 12px 16px;
      margin: 8px 0;
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(13, 71, 161, 0.1);
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
      text-align: left;
      color: #0d47a1;
      font-weight: 500;
    }
    .query-item:hover {
      background: #0d47a1;
      color: white;
      transform: translateX(5px);
    }
    .answer-box {
      margin-top: 15px;
      padding: 14px;
      background: #f0f7ff;
      border-radius: 12px;
      border-left: 4px solid #0d47a1;
      font-size: 0.88rem;
      color: #333;
      line-height: 1.5;
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .typing-cursor::after {
      content: '|';
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .bot-label {
      background: #0d47a1;
      color: white;
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-right: 12px;
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.2);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s ease;
      position: absolute;
      right: 85px;
      bottom: 18px;
    }
    .bot-container:hover .bot-label {
      opacity: 1;
      transform: translateX(0);
    }
    .stylish-icon {
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    @media (max-width: 600px) {
      .chat-window { width: 90vw !important; bottom: 90px !important; right: 5vw !important; }
      .bot-label { display: none !important; }
    }
  `;

    // Modern Stylish Assistant Icon with Headset and Medical Detail
    const IconHuman = () => (
        <svg width="42" height="42" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="stylish-icon">
            <defs>
                <linearGradient id="skinGrad" x1="32" y1="15" x2="32" y2="45" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E3F2FD" />
                </linearGradient>
            </defs>
            {/* Avatar Head */}
            <circle cx="32" cy="28" r="14" fill="url(#skinGrad)" />
            {/* Body */}
            <path d="M16 52C16 46.4772 20.4772 42 26 42H38C43.5228 42 48 46.4772 48 52V54H16V52Z" fill="white" />
            {/* Stylized Headset */}
            <path d="M22 28C22 22.4772 26.4772 18 32 18C37.5228 18 42 22.4772 42 28" stroke="#1976D2" strokeWidth="3" strokeLinecap="round" />
            <rect x="18" y="26" width="6" height="8" rx="3" fill="#0D47A1" />
            <rect x="40" y="26" width="6" height="8" rx="3" fill="#0D47A1" />
            {/* Medical Cross Detail on Chest */}
            <rect x="31" y="45" width="2" height="6" fill="#0D47A1" />
            <rect x="29" y="47" width="6" height="2" fill="#0D47A1" />
        </svg>
    );

    return (
        <>
            <style>{animationStyles}</style>
            <div className="bot-container" style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'flex-end',
                fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '15px'
                }}>
                    {isOpen && (
                        <div style={{
                            width: '350px', // Slightly larger
                            maxHeight: '550px',
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(13, 71, 161, 0.2)',
                            border: '1px solid rgba(13, 71, 161, 0.1)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            animation: 'slideIn 0.3s ease-out',
                            marginBottom: '10px'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
                                padding: '24px 20px',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}>
                                        <IconHuman />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>HealthHub Assistant</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span style={{ width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%' }}></span>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Available to help</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        fontSize: '1.2rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                >×</button>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                    <div style={{ width: '30px', height: '30px', background: '#e3f2fd', borderRadius: '50%', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0d47a1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#455a64', margin: 0, lineHeight: '1.4' }}>
                                        Hi! I'm your personal assistant. How can I help you navigate HealthHub today?
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {faqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            className="query-item"
                                            style={{
                                                backgroundColor: activeQuery === index ? '#0d47a1' : 'rgba(255,255,255,0.8)',
                                                color: activeQuery === index ? 'white' : '#0d47a1',
                                                boxShadow: activeQuery === index ? '0 4px 12px rgba(13, 71, 161, 0.2)' : 'none'
                                            }}
                                            onClick={() => handleQueryClick(index)}
                                        >
                                            {faq.q}
                                        </div>
                                    ))}
                                </div>

                                {activeQuery !== null && (
                                    <div className="answer-box">
                                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', color: '#0d47a1', fontWeight: 'bold' }}>Our Response</div>
                                        <span className={isTyping ? "typing-cursor" : ""}>
                                            {displayedAnswer}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Toggle Button Group */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {!isOpen && <div className="bot-label">HealthHub Assistant</div>}

                        <div
                            className={isOpen ? "" : "bot-pulse"}
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                width: '75px', // Larger ball
                                height: '75px',
                                backgroundColor: '#0d47a1',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 8px 25px rgba(13, 71, 161, 0.4)',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'scale(1)',
                                border: '3px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            {isOpen ? (
                                <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>×</span>
                            ) : (
                                <IconHuman />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SupportBot;
