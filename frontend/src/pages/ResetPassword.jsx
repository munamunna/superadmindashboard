import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (form.newPassword !== form.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (form.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/reset-password/', {
                token: token,
                new_password: form.newPassword,
                confirm_password: form.confirmPassword
            });

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/user-login');
            }, 3000);

        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <div style={styles.iconContainer}>
                            <svg style={{ ...styles.icon, color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 style={styles.title}>Password Reset Successful!</h1>
                        <p style={styles.subtitle}>Your password has been changed</p>
                    </div>

                    <div style={styles.successBox}>
                        <p style={{ margin: 0, textAlign: 'center' }}>
                            You can now login with your new password.<br />
                            Redirecting to login page...
                        </p>
                    </div>

                    <div style={styles.footer}>
                        <Link to="/user-login" style={styles.link}>
                            Go to login now →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconContainer}>
                        <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 style={styles.title}>Reset Your Password</h1>
                    <p style={styles.subtitle}>Enter your new password below</p>
                </div>

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
                        <label style={styles.label}>New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            style={styles.input}
                            value={form.newPassword}
                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                            required
                            minLength={6}
                        />
                        <p style={styles.hint}>Minimum 6 characters</p>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            style={styles.input}
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                            minLength={6}
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
                        {loading ? 'Resetting...' : 'Reset Password'}
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
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
        color: '#8b5cf6',
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
        padding: '24px',
        marginBottom: '24px',
        color: '#065f46',
        fontSize: '16px',
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
    hint: {
        fontSize: '12px',
        color: '#9ca3af',
        marginTop: '4px',
        marginBottom: 0,
    },
    button: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
    },
    link: {
        color: '#8b5cf6',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'color 0.3s ease',
    },
};

export default ResetPassword;
