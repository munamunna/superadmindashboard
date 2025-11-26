# 🎨 Super Admin Dashboard - Frontend

React + Vite frontend for the Super Admin Dashboard application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Features

- ✅ Modern React 18 with Hooks
- ✅ Vite for fast development and building
- ✅ React Router DOM for routing
- ✅ Axios for API calls
- ✅ Context API for state management
- ✅ CSS-in-JS styling
- ✅ JWT authentication with auto-refresh
- ✅ Role-based access control
- ✅ Responsive design

## 🛠️ Tech Stack

- **React** 18.3.1
- **React Router DOM** 6.28.0
- **Axios** 1.7.9
- **Vite** 6.0.1
- **ESLint** 9.17.0

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ProtectedRoute.jsx
│   ├── PermissionProtectedRoute.jsx
│   └── CommentSection.jsx
├── context/            # React Context
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── LandingPage.jsx
│   ├── AdminLogin.jsx
│   ├── UserLogin.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── UserManagement.jsx
│   ├── UserPermissions.jsx
│   ├── Unauthorized.jsx
│   └── [ContentPages].jsx
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🔐 Authentication Flow

1. User selects portal (Admin/User) on landing page
2. Enters credentials on respective login page
3. Backend validates and returns JWT tokens
4. Frontend stores tokens in localStorage
5. Auto-refresh token before expiration
6. Redirect based on user role and permissions

## 🎨 Styling Approach

This project uses **CSS-in-JS** (inline styles) for component styling:

```javascript
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
};

<div style={styles.container}>...</div>
```

### Benefits:
- Component-scoped styles
- No class name conflicts
- Dynamic styling based on state
- Everything in one file

## 🌐 API Integration

Base URL: `http://127.0.0.1:8000/api/auth/`

All API calls use Axios with automatic token injection:

```javascript
// Example API call
const response = await axios.get('http://127.0.0.1:8000/api/auth/my-permissions/', {
  headers: { Authorization: `Bearer ${accessToken}` }
});
```

## 🔄 State Management

Uses React Context API for global state:

- **AuthContext**: User authentication, tokens, permissions
- **hasPagePermission**: Helper function to check permissions

```javascript
const { user, accessToken, permissions, hasPagePermission } = useContext(AuthContext);

if (hasPagePermission('products', 'can_view')) {
  // Show products page
}
```

## 🛣️ Routing

```javascript
/                           → Landing Page (portal selection)
/admin-login                → Admin Login
/user-login                 → User Login
/forgot-password            → Password reset request
/reset-password/:token      → Password reset form
/unauthorized               → Access denied page

// Admin-only routes
/dashboard                  → User Management
/permissions                → Permission Management

// Permission-protected routes
/products                   → Products Page
/marketing                  → Marketing Page
/orders                     → Orders Page
// ... and 7 more content pages
```

## 🎨 Color Themes

| Page | Primary Color | Gradient |
|------|---------------|----------|
| Landing | Blue | `#3b82f6` → `#2563eb` |
| Admin Login | Purple | `#667eea` → `#764ba2` |
| User Login | Green | `#10b981` → `#059669` |
| Forgot Password | Orange | `#f59e0b` → `#d97706` |
| Reset Password | Purple | `#8b5cf6` → `#7c3aed` |

## 🧪 Development

### Available Scripts

```bash
# Start dev server (http://localhost:5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## 📦 Dependencies

### Production
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting
- `eslint-plugin-react` - React-specific linting rules

## 🔧 Configuration

### Vite Config (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
})
```

### ESLint Config (`eslint.config.js`)

Configured for React best practices and hooks rules.

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Deploy Options

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Configure in package.json
- **Custom Server**: Serve `dist/` folder

### Environment Variables for Production

Set these in your deployment platform:
- `VITE_API_URL` - Your production API URL

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Check backend CORS settings in `backend/settings.py`

### Issue: 404 on Refresh
**Solution**: Configure server to serve `index.html` for all routes

### Issue: API calls failing
**Solution**: Verify backend is running and API URL is correct

### Issue: Token expired
**Solution**: Token auto-refreshes. Check AuthContext implementation.

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 🤝 Contributing

See main project README for contribution guidelines.

---

**Built with React + Vite** ⚡
