import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const UserLogin = () => {
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
            console.log("=== LOGIN ATTEMPT ===");
            console.log("Email:", form.email);

            const data = await login(form.email, form.password);
            console.log("Login successful, user data:", data.user);

            // If user is super admin, redirect them to admin portal
            if (data.user.is_super_admin) {
                console.log("User is super admin, should use admin portal");
                setError("Please use the Admin Portal to login");
                setLoading(false);
                return;
            }

            // Wait a brief moment for permissions to be saved to localStorage
            await new Promise(resolve => setTimeout(resolve, 200));

            // For regular users, check permissions from localStorage
            const storedPermissions = localStorage.getItem("permissions");
            console.log("Stored permissions (raw):", storedPermissions);

            if (!storedPermissions) {
                console.error("No permissions found in localStorage");
                setError("Failed to load permissions. Please try again or contact your administrator.");
                setLoading(false);
                return;
            }

            const perms = JSON.parse(storedPermissions);
            console.log("Parsed permissions:", perms);
            console.log("Number of permissions:", perms.length);

            // Find first page with view access
            const pageWithAccess = perms.find(p => p.can_view === true);
            console.log("First page with access:", pageWithAccess);

            if (pageWithAccess) {
                const targetPage = `/${pageWithAccess.page_name}`;
                console.log("Redirecting to:", targetPage);
                navigate(targetPage);
            } else {
                console.warn("User has permissions but none have can_view=true");
                setError("You don't have access to any pages. Please contact your administrator.");
                setLoading(false);
            }

        } catch (err) {
            console.error("=== LOGIN ERROR ===");
            console.error("Error details:", err);
            console.error("Error response:", err.response?.data);
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconContainer}>
                        <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 style={styles.title}>User Portal</h1>
                    <p style={styles.subtitle}>Sign in to access your workspace</p>
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
                            placeholder="user@example.com"
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={styles.infoBox}>
                    <svg style={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p style={styles.infoText}>
                        You'll be redirected to your assigned pages based on your permissions.
                    </p>
                </div>

                <div style={styles.footer}>
                    <Link to="/forgot-password" style={styles.forgotLink}>
                        Forgot Password?
                    </Link>
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
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
        color: '#10b981',
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
    infoBox: {
        backgroundColor: '#dbeafe',
        border: '1px solid #93c5fd',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    infoIcon: {
        width: '20px',
        height: '20px',
        color: '#2563eb',
        flexShrink: 0,
        marginTop: '2px',
    },
    infoText: {
        fontSize: '14px',
        color: '#1e40af',
        margin: 0,
        lineHeight: '1.5',
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
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    forgotLink: {
        color: '#f59e0b',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'color 0.3s ease',
    },
    link: {
        color: '#10b981',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'color 0.3s ease',
    },
};

export default UserLogin;
