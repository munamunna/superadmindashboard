# Token Refresh Implementation

This document explains the automatic token refresh feature that was added to keep users logged in even when their access token expires.

## The Problem

JWT tokens have an expiration time for security. When a token expires:
- API requests fail with `401 Unauthorized`
- User data doesn't load
- User gets kicked out

## The Solution: Automatic Token Refresh

We implemented an **axios interceptor** that automatically refreshes expired tokens in the background.

## Files Modified

### 1. **AuthContext.jsx** - Added Axios Interceptor

```javascript
useEffect(() => {
  const interceptor = axios.interceptors.response.use(
    (response) => response, // If successful, just return the response
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refresh");
          
          if (!refreshToken) {
            logout();
            return Promise.reject(error);
          }

          // Try to refresh the token
          const res = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", {
            refresh: refreshToken
          });

          // Update the access token
          const newAccessToken = res.data.access;
          localStorage.setItem("access", newAccessToken);
          setAccessToken(newAccessToken);

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return axios(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return () => {
    axios.interceptors.response.eject(interceptor);
  };
}, []);
```

**What it does:**
1. Intercepts all axios responses
2. If it sees a 401 error, it tries to refresh the token
3. If refresh succeeds, it retries the original request with the new token
4. If refresh fails, it logs the user out

### 2. **settings.py** (Backend) - JWT Configuration

```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),  # Short for testing
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
```

**What it does:**
- Sets access token to expire in 5 minutes (for testing)
- Sets refresh token to expire in 7 days
- Configures JWT settings for the backend

### 3. **UserManagement.jsx & UserPermissions.jsx** - Error Handling

Added proper error handling and loading states:

```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchUsers = async () => {
  try {
    setLoading(true);
    setError(null);
    const res = await axios.get("http://127.0.0.1:8000/api/auth/users/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setUsers(res.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**What it does:**
- Shows loading state while fetching
- Catches and displays errors
- Provides better user feedback

## How It All Works Together

1. **User logs in** → Gets access token (5 min) + refresh token (7 days)
2. **User browses the app** → Access token is used for API requests
3. **After 5 minutes** → Access token expires
4. **Next API request fails** → Interceptor catches the 401 error
5. **Interceptor refreshes token** → Gets new access token using refresh token
6. **Request retries automatically** → User doesn't notice anything!
7. **After 7 days** → Refresh token expires, user must login again

## Benefits

✅ Users stay logged in even after closing the browser
✅ Seamless experience - no interruptions
✅ Secure - tokens still expire, but refresh happens automatically
✅ Better error handling and user feedback

## Testing

1. Login to the app
2. Wait 5 minutes (or set shorter expiration for testing)
3. Navigate to different pages or refresh
4. Data should load automatically without re-login!
