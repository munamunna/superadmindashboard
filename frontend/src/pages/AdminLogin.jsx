import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(form.email, form.password);
            if (data.user.is_super_admin) {
                navigate("/dashboard");
            } else {
                setError("Access denied: Super Admin privileges required");
            }
        } catch (err) {
            setError("Invalid credentials. Please try again.");
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 style={styles.title}>Admin Portal</h1>
                    <p style={styles.subtitle}>Sign in with your administrator account</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorBox}>
                            <svg style={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            style={styles.input}
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            style={styles.input}
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
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
                        {loading ? 'Signing in...' : 'Sign In as Admin'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <Link to="/" style={styles.link}>
                        ← Back to portal selection
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        color: '#667eea',
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
    button: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'color 0.3s ease',
    },
};

export default AdminLogin;
