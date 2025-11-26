import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/request-password-reset/', {
                email
            });

            setMessage(response.data.message);

            // For development: show the token
            if (response.data.token) {
                setResetToken(response.data.token);
            }

            setEmail('');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconContainer}>
                        <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 style={styles.title}>Forgot Password?</h1>
                    <p style={styles.subtitle}>Enter your email to reset your password</p>
                </div>

                {message && (
                    <div style={styles.successBox}>
                        <svg style={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p style={{ margin: 0 }}>{message}</p>
                            {resetToken && (
                                <div style={styles.devInfo}>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                                        <strong>Dev Mode:</strong> <Link to={`/reset-password/${resetToken}`} style={styles.resetLink}>
                                            Click here to reset password
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div style={styles.errorBox}>
                        <svg style={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <Link to="/user-login" style={styles.link}>
                        ← Back to login
                    </Link>
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
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    icon: {
        width: '64px',
        height: '64px',
        color: '#f59e0b',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#6b7280',
    },
    form: {
        marginBottom: '24px',
    },
    successBox: {
        backgroundColor: '#d1fae5',
        border: '1px solid #6ee7b7',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        color: '#065f46',
        fontSize: '14px',
    },
    successIcon: {
        width: '20px',
        height: '20px',
        flexShrink: 0,
        marginTop: '2px',
    },
    errorBox: {
        backgroundColor: '#fee2e2',
        border: '1px solid #fca5a5',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#dc2626',
        fontSize: '14px',
    },
    errorIcon: {
        width: '20px',
        height: '20px',
        flexShrink: 0,
    },
    devInfo: {
        backgroundColor: '#fef3c7',
        padding: '8px',
        borderRadius: '8px',
        marginTop: '8px',
    },
    resetLink: {
        color: '#065f46',
        textDecoration: 'underline',
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: '24px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        fontSize: '16px',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
    },
    link: {
        color: '#f59e0b',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'color 0.3s ease',
    },
};

export default ForgotPassword;
