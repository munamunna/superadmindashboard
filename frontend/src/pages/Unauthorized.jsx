import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconContainer}>
                    <svg
                        style={styles.icon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>

                <h1 style={styles.title}>Access Denied</h1>
                <p style={styles.message}>
                    You don't have permission to access this page.
                </p>
                <p style={styles.submessage}>
                    Please contact your administrator if you believe this is an error.
                </p>

                <div style={styles.buttonContainer}>
                    <button onClick={handleGoBack} style={styles.backButton}>
                        Go Back
                    </button>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    icon: {
        width: '80px',
        height: '80px',
        color: '#ef4444',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px',
    },
    message: {
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '8px',
    },
    submessage: {
        fontSize: '14px',
        color: '#9ca3af',
        marginBottom: '32px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
    },
    backButton: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#667eea',
        backgroundColor: 'white',
        border: '2px solid #667eea',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    logoutButton: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: '#667eea',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
};

export default Unauthorized;
