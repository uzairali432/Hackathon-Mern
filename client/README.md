# MERN Frontend - React + Vite

Modern React 19 frontend with Redux Toolkit, RTK Query, and Tailwind CSS.

## Quick Start

### Installation
```bash
pnpm install
```

### Environment Setup
```bash
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api/v1
```

### Development
```bash
pnpm run dev
```

Application runs on `http://localhost:5173`

### Production Build
```bash
pnpm run build
pnpm run preview
```

## Project Structure

```
client/src/
├── pages/                   # Page components
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   ├── SettingsPage.jsx
│   ├── AdminPage.jsx
│   └── NotFoundPage.jsx
├── routes/                  # Route components
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
├── services/               # API integration
│   ├── authApi.js         # Auth endpoints (RTK Query)
│   ├── userApi.js         # User endpoints (RTK Query)
│   └── axiosInstance.js   # Axios configuration
├── store/                  # Redux state
│   ├── store.js           # Store config
│   └── slices/
│       ├── authSlice.js   # Auth state
│       └── userSlice.js   # User state
├── styles/                 # Global styles
│   └── index.css
├── App.jsx                # Main App component
└── main.jsx              # React entry point
```

## Features

### Authentication
- User signup and login
- JWT token management
- Automatic token refresh
- Protected routes
- Role-based access (Admin)

### Pages
- **Login** - User authentication
- **Signup** - New user registration
- **Dashboard** - User home page
- **Profile** - Edit user information
- **Settings** - Change password
- **Admin Panel** - User management
- **404** - Not found page

### State Management
- Redux Toolkit for global state
- RTK Query for API data fetching
- localStorage for token persistence

## API Integration

### RTK Query

Authentication endpoints:
```javascript
import { useLoginMutation, useSignupMutation } from '../services/authApi';

const [login, { isLoading }] = useLoginMutation();
const response = await login({ email, password }).unwrap();
```

User endpoints:
```javascript
import { useUpdateProfileMutation } from '../services/userApi';

const [updateProfile] = useUpdateProfileMutation();
await updateProfile({ firstName, lastName }).unwrap();
```

### Axios Instance

Automatic token attachment:
```javascript
import axiosInstance from './services/axiosInstance';

// Token is automatically added to headers
const response = await axiosInstance.get('/users/me');
```

## Authentication Flow

1. User logs in via LoginPage
2. Credentials sent to backend
3. Access token stored in Redux + localStorage
4. Access token used in Authorization header
5. On 401 response, refresh token is used
6. New access token obtained automatically
7. Failed refresh logs out user

## Protected Routes

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## Role-Based Routes

```jsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  }
/>
```

## State Management

### Auth State
```javascript
const { user, isAuthenticated, accessToken } = useSelector(state => state.auth);
const dispatch = useDispatch();
dispatch(logout());
```

### User State
```javascript
const { users, currentUser, loading } = useSelector(state => state.user);
```

## Form Handling

Using React Hook Form + Yup:
```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});
```

## Environment Variables

```
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=MERN Boilerplate
VITE_APP_ENV=development
```

## Styling

### Tailwind CSS
Utility-first CSS framework for styling.

### Color Scheme
- Primary: Blue (#2563eb)
- Secondary: Slate (#64748b)
- Accent: Cyan (#06b6d4)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Warning: Amber (#f59e0b)

### Global Styles
- Located in `src/styles/index.css`
- Animations and utilities defined
- Responsive design mobile-first

## Components

### Page Components
Each page handles its own routing and layout:
- Login/Signup - Public pages
- Dashboard - User dashboard
- Profile - Profile editing
- Settings - Account settings
- Admin - User management
- 404 - Not found

### Route Components
- **ProtectedRoute** - Requires authentication
- **AdminRoute** - Requires admin role

## Development Tips

### Adding New API Endpoints

1. Create endpoint in RTK Query:
```javascript
// services/exampleApi.js
export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getExample: builder.query({
      query: () => '/example',
    }),
  }),
});
```

2. Add to store:
```javascript
// store/store.js
[exampleApi.reducerPath]: exampleApi.reducer,
```

3. Use in component:
```javascript
import { useGetExampleQuery } from '../services/exampleApi';
const { data } = useGetExampleQuery();
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Use ProtectedRoute or AdminRoute if needed

### Error Handling

Try-catch with user feedback:
```javascript
try {
  await login(credentials).unwrap();
  navigate('/dashboard');
} catch (error) {
  setErrorMessage(error.data?.message || 'Login failed');
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

### Code Splitting
Routes are lazy loaded for better performance.

### Caching
RTK Query automatically caches API responses.

### Bundle Size
- React: 42KB
- Redux: 25KB
- Tailwind: ~50KB (with purge)

## Testing

### Manual Testing
1. Sign up with new account
2. Login with credentials
3. Navigate through pages
4. Edit profile
5. Change password
6. Test admin panel (if admin)
7. Logout

## Troubleshooting

### API Connection Error
- Check VITE_API_URL in .env
- Ensure backend is running on port 5000
- Check browser console for CORS errors

### Token Expiration
- Automatic refresh should handle this
- Manual logout: Clear localStorage and reload

### Route Not Found
- Check route path in App.jsx
- Ensure page component is imported

### Form Validation Not Working
- Check Yup schema definition
- Verify useForm resolver setup
- Check field names match schema

## Next Steps

1. Add user profile picture upload
2. Implement dark mode toggle
3. Add notifications/toast messages
4. Create reusable components library
5. Add comprehensive error boundaries
6. Implement service worker for offline support
7. Add progressive web app features
8. Create comprehensive test suite

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Yup Documentation](https://github.com/jquense/yup)
- [Tailwind CSS](https://tailwindcss.com/)
