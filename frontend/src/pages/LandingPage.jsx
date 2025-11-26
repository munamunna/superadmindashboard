import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Super Admin Dashboard</h1>
                    <p style={styles.subtitle}>Choose your login portal</p>
                </div>

                <div style={styles.cardContainer}>
                    {/* Admin Login Card */}
                    <div
                        style={styles.card}
                        onClick={() => navigate('/admin-login')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
                        }}
                    >
                        <div style={styles.iconContainer}>
                            <svg style={{ ...styles.icon, color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 style={styles.cardTitle}>Admin Portal</h2>
                        <p style={styles.cardDescription}>
                            Full system access for administrators. Manage users, permissions, and all system settings.
                        </p>
                        <div style={{ ...styles.badge, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            Super Admin Only
                        </div>
                    </div>

                    {/* User Login Card */}
                    <div
                        style={styles.card}
                        onClick={() => navigate('/user-login')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
                        }}
                    >
                        <div style={styles.iconContainer}>
                            <svg style={{ ...styles.icon, color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 style={styles.cardTitle}>User Portal</h2>
                        <p style={styles.cardDescription}>
                            Access your assigned pages and features. View, create, and manage content based on your permissions.
                        </p>
                        <div style={{ ...styles.badge, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            Regular Users
                        </div>
                    </div>
                </div>

                <footer style={styles.footer}>
                    <p style={styles.footerText}>© 2025 Super Admin Dashboard. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    content: {
        width: '100%',
        maxWidth: '1200px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '60px',
    },
    title: {
        fontSize: '48px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '16px',
    },
    subtitle: {
        fontSize: '20px',
        color: '#94a3b8',
    },
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        marginBottom: '60px',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '40px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    },
    iconContainer: {
        marginBottom: '24px',
    },
    icon: {
        width: '64px',
        height: '64px',
    },
    cardTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '16px',
    },
    cardDescription: {
        fontSize: '16px',
        color: '#cbd5e1',
        lineHeight: '1.6',
        marginBottom: '24px',
    },
    badge: {
        display: 'inline-block',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        color: 'white',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    footerText: {
        color: '#64748b',
        fontSize: '14px',
    },
};

export default LandingPage;
