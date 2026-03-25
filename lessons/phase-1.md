# P1: Backend Integration - Developer Guide

Welcome! This guide will walk you through implementing backend functionality for the Travel Memory React application. By the end of this phase, you will have learned essential React hooks, mastered TanStack Query for server state management, and built several custom hooks.

---

## 📚 Learning Objectives

By completing this phase, you will understand:
- Core React hooks (`useState`, `useEffect`, `useContext`, `useRef`, `useCallback`, `useMemo`)
- TanStack Query for data fetching, caching, and mutations
- Building reusable custom hooks
- Authentication flows with JWT tokens
- File uploads with multipart/form-data
- Manually attaching auth tokens to protected API requests

---

## 🗂️ Project Structure Overview

```
frontend/
├── src/
│   ├── api/                    # API utilities and configuration
│   │   ├── client.js          # Axios/fetch client setup
│   │   ├── auth.js            # Auth API functions
│   │   └── images.js          # Image API functions
│   ├── hooks/                  # Custom hooks directory
│   │   ├── useAuth.js         # Authentication hook
│   │   ├── useImages.js       # Image management hook
│   │   ├── useUpload.js       # File upload hook
│   │   └── useAnalytics.js    # Analytics hook
│   ├── context/               # React Context providers
│   │   └── AuthContext.jsx    # Auth state management
│   ├── components/            # UI Components (already exist)
│   │   ├── Auth.jsx
│   │   ├── Gallery.jsx
│   │   ├── Analytics.jsx
│   │   └── ...
│   ├── constants.js           # Mock data (will be replaced)
│   └── App.jsx                # Router setup (already exists)
└── package.json
```

---

## 🚀 Task Checklist

### Part 1: TanStack Query Setup

- [ ] **Install TanStack Query**
  ```bash
  npm install @tanstack/react-query
  ```

- [ ] **Configure QueryClient in `main.jsx`**
  ```jsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
      },
    },
  });
  
  // Wrap your app with QueryClientProvider
  ```

**Learning Resource:** Understand what `staleTime`, `gcTime`, and `refetchOnWindowFocus` do in TanStack Query.

---

### Part 2: API Client Setup

Create `src/api/client.js`:

- [ ] Configure axios instance with base URL (`/api`)
- [ ] Export a helper function `getAuthHeaders()` to retrieve token from localStorage
- [ ] Export typed API functions for each endpoint that **manually attach** the token to protected requests

```javascript
// src/api/client.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Helper to get auth headers for protected requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Example: Public API call (no auth needed)
export const registerApi = (data) => apiClient.post('/auth/register', data);
export const loginApi = (data) => apiClient.post('/auth/login', data);

// Example: Protected API call (auth required)
export const fetchImagesApi = (params = {}) => {
  return apiClient.get('/images', {
    params,
    headers: getAuthHeaders()
  });
};

export const uploadImageApi = (formData) => {
  return apiClient.post('/images/upload', formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteImagesApi = (ids) => {
  return apiClient.delete('/images', {
    data: { ids },
    headers: getAuthHeaders()
  });
};
```

**Important:** You must manually attach `getAuthHeaders()` to every protected API call. The token should NOT be sent for public routes like `/auth/register` and `/auth/login`.

---

### Part 3: Authentication System

#### A. Auth Context (`src/context/AuthContext.jsx`)

- [ ] Create `AuthContext` using React Context API
- [ ] Implement `useAuth` custom hook pattern:
  ```jsx
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
  };
  ```
- [ ] State should include: `user`, `token`, `isAuthenticated`, `isLoading`
- [ ] Methods: `login`, `register`, `logout`
- [ ] On mount, check localStorage for existing token and validate it

**React Hooks Used:** `useState`, `useEffect`, `useContext`, `useCallback`

#### B. Login Component (`src/components/Auth.jsx`)

- [ ] Replace mock form submission with TanStack Query mutation
- [ ] Handle loading, error, and success states
- [ ] Store JWT token in localStorage on success
- [ ] Navigate to home on successful login

```jsx
// Example mutation structure
const loginMutation = useMutation({
  mutationFn: (credentials) => loginApi(credentials),
  onSuccess: (data) => {
    localStorage.setItem('token', data.token);
    login(data.user);
    navigate('/');
  },
  onError: (error) => {
    // Handle error display
  }
});
```

#### C. SignUp Component

- [ ] Implement registration with TanStack Query mutation
- [ ] Validate form inputs (username, email, password)
- [ ] Handle success by auto-logging in the user
- [ ] Display appropriate error messages

---

### Part 4: Custom Hooks

Create reusable custom hooks in `src/hooks/`:

#### A. `useImages.js` - Image Fetching & Management

- [ ] Create `useImages(queryParams)` hook
- [ ] Use TanStack Query `useQuery` for fetching images
- [ ] Return: `{ images, isLoading, error, refetch }`
- [ ] Handle query parameter filtering (name, status, dateRange, etc.)

```jsx
export const useImages = (filters = {}) => {
  return useQuery({
    queryKey: ['images', filters],
    queryFn: () => fetchImagesApi(filters),
  });
};
```

#### B. `useUpload.js` - File Upload

- [ ] Create `useUpload()` hook
- [ ] Use TanStack Query `useMutation`
- [ ] Support multipart/form-data uploads
- [ ] Return: `{ upload, isUploading, progress, error }`
- [ ] Implement progress tracking

```jsx
export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: async ({ file, name }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', name);
      
      // Use axios with onUploadProgress for progress tracking
      return uploadImageApi(formData);
    },
    onSuccess: () => {
      setProgress(0);
      // Invalidate images query to refetch
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
  
  return { 
    upload: uploadMutation.mutate, 
    isUploading: uploadMutation.isPending, 
    progress,
    error: uploadMutation.error,
    ...uploadMutation 
  };
};
```

#### C. `useDeleteImages.js` - Image Deletion

- [ ] Create `useDeleteImages()` hook
- [ ] Support single and bulk deletion
- [ ] Return: `{ deleteImages, isDeleting, ... }`
- [ ] Optimistically update the UI using TanStack Query

```jsx
export const useDeleteImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids) => deleteImagesApi(ids),
    onMutate: async (ids) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['images'] });
      
      // Snapshot previous value
      const previousImages = queryClient.getQueryData(['images']);
      
      // Optimistically update
      queryClient.setQueryData(['images'], (old) => 
        old?.filter(img => !ids.includes(img._id))
      );
      
      return { previousImages };
    },
    onError: (err, ids, context) => {
      // Rollback on error
      queryClient.setQueryData(['images'], context.previousImages);
    },
    onSettled: () => {
      // Refetch to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};
```

#### D. `useAnalytics.js` - Analytics Data

- [ ] Create `useAnalytics()` hook
- [ ] Fetch image count and upload leaderboard
- [ ] Return: `{ stats, leaderboard, isLoading }`
- [ ] Handle metric and limit query parameters

```jsx
export const useAnalytics = (options = {}) => {
  const statsQuery = useQuery({
    queryKey: ['analytics', 'images', options.status],
    queryFn: () => getImageCountApi(options.status),
  });

  const leaderboardQuery = useQuery({
    queryKey: ['analytics', 'uploads', options.metric, options.limit],
    queryFn: () => getLeaderboardApi(options.metric, options.limit),
  });

  return {
    stats: statsQuery.data,
    leaderboard: leaderboardQuery.data,
    isLoading: statsQuery.isLoading || leaderboardQuery.isLoading,
  };
};
```

---

### Part 5: Component Integration

Update the existing components to use the new hooks:

#### A. `Gallery.jsx` - Full Integration

- [ ] Import and use `useImages` hook
- [ ] Replace `MOCK_IMAGES` with real data
- [ ] Implement search with debouncing (use `useCallback` for memoization)
- [ ] Add filter dropdown functionality (status, date range)
- [ ] Implement delete all functionality with confirmation dialog
- [ ] Add file upload via drag-and-drop or button click
- [ ] Show loading skeletons during data fetching

**React Hooks Used:** `useState`, `useCallback`, `useMemo`

**Debounced Search Example:**
```jsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

// Debounce the search input
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);

// Use debounced value in query
const { data: images } = useImages({ name: debouncedSearch });
```

#### B. `Analytics.jsx` - Real Data

- [ ] Import and use `useAnalytics` hook
- [ ] Replace hardcoded numbers with real stats
- [ ] Update leaderboard with real data
- [ ] Add loading states

#### C. `TopNavBar.jsx` - Auth State

- [ ] Import and use `useAuth` hook
- [ ] Display logged-in user's username
- [ ] Update logout button to actually log out user
- [ ] Conditionally show/hide based on auth state

#### D. `ImageCard.jsx` - Individual Actions

- [ ] Accept image data as props
- [ ] Add delete button with confirmation
- [ ] Add edit functionality (if backend supports it)

---

### Part 6: Advanced Features

- [ ] **Debounced Search**: Implement debouncing for search input using `useRef` and `setTimeout`
- [ ] **Optimistic Updates**: Use TanStack Query's optimistic update patterns for instant feedback
- [ ] **Error Boundaries**: Create an error boundary component for graceful error handling
- [ ] **Loading States**: Add skeleton loaders that match the component layout

---

## 📖 Learning Topics

### Core React Hooks

| Hook | Purpose | When to Use |
|------|---------|-------------|
| `useState` | Manage local component state | Form inputs, toggles, counters |
| `useEffect` | Handle side effects | API calls, subscriptions, DOM manipulation |
| `useContext` | Access context values | Global state (auth, themes) |
| `useRef` | Access DOM elements or persist values | Focus, timers, previous values |
| `useCallback` | Memoize functions | Prevent unnecessary re-renders, stable function references |
| `useMemo` | Memoize computed values | Expensive calculations, derived state |

### TanStack Query Concepts

| Concept | Description |
|---------|-------------|
| `useQuery` | Fetch data with caching and background refetching |
| `useMutation` | Handle create/update/delete operations |
| Query Keys | Unique identifiers for cache management |
| `invalidateQueries` | Mark queries as stale to refetch |
| `optimisticUpdate` | Update UI immediately before server confirmation |
| `staleTime` | How long data is considered fresh |
| `gcTime` | How long unused data stays in cache |

### Custom Hook Patterns

1. **Data Fetching Hooks**: Encapsulate TanStack Query logic
2. **Form Hooks**: Manage form state and validation
3. **Interaction Hooks**: Handle specific user interactions (upload, drag-drop)
4. **Utility Hooks**: Reusable logic (debounce, localStorage)

---

## 🔧 API Endpoints Summary

| Method | Endpoint | Purpose | Auth | Token Required |
|--------|----------|---------|------|----------------|
| POST | `/api/auth/register` | Create new user | No | ❌ |
| POST | `/api/auth/login` | Get JWT token | No | ❌ |
| POST | `/api/images/upload` | Upload image file | Yes | ✅ |
| GET | `/api/images` | List images (with filters) | Yes | ✅ |
| DELETE | `/api/images` | Delete images | Yes | ✅ |
| GET | `/api/analytics/images` | Get image count | Yes | ✅ |
| GET | `/api/analytics/uploads` | Get leaderboard | Yes | ✅ |

**Remember:** Only attach `Authorization: Bearer <token>` header to protected routes!

---

## ✅ Success Criteria

Your implementation is complete when:

1. ✅ Users can register and login
2. ✅ JWT token is stored in localStorage and manually attached to protected requests
3. ✅ Unauthenticated users are redirected to login (handle 401 responses)
4. ✅ Images display from the real API
5. ✅ Image search filters work with debouncing
6. ✅ Images can be uploaded via drag-and-drop
7. ✅ Images can be deleted (single and bulk)
8. ✅ Analytics dashboard shows real data
9. ✅ TanStack Query caching works (data persists on navigation)
10. ✅ Loading and error states are displayed appropriately
11. ✅ Custom hooks are reusable and well-documented

---

## 🐛 Common Issues & Debugging

### Issue: 401 Unauthorized Errors
- Token may not be attached to the request - check `getAuthHeaders()` is called
- Token may have expired - implement token refresh or logout
- Check if localStorage is being used correctly

### Issue: Token Sent to Public Routes
- Make sure `getAuthHeaders()` is NOT called for `/auth/register` and `/auth/login`
- Public routes should not receive auth headers

### Issue: Data Not Refreshing
- Ensure `queryClient.invalidateQueries()` is called after mutations
- Check query key consistency between fetch and invalidation

### Issue: Upload Progress Not Working
- Axios `onUploadProgress` only works with axios, not fetch
- Make sure you're using axios for uploads

### Issue: CORS Errors
- Backend needs to allow requests from your frontend origin
- Check backend CORS configuration

---

## 📝 Code Style Guidelines

1. **Naming Conventions**:
   - Hooks: `useCamelCase` (e.g., `useImages`, `useUpload`)
   - API functions: `camelCase` (e.g., `fetchImages`, `loginUser`)
   - Query keys: Array format `['resource', { filter: value }]`

2. **Error Handling**:
   - Always handle errors in mutations with `onError`
   - Display user-friendly error messages
   - Log errors for debugging (in development only)

3. **Token Management**:
   - Always use `getAuthHeaders()` helper for protected routes
   - Never hardcode tokens
   - Handle missing tokens gracefully

---

## 🔗 Resources & References

### ⚛️ React Core

| Topic                         | Link                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------- |
| All Built-in React Hooks      | [react.dev/reference/react/hooks](https://react.dev/reference/react/hooks)   |
| `useState`                    | [react.dev – useState](https://react.dev/reference/react/useState)           |
| `useEffect`                   | [react.dev – useEffect](https://react.dev/reference/react/useEffect)         |
| `useContext`                  | [react.dev – useContext](https://react.dev/reference/react/useContext)       |
| `useCallback`                 | [react.dev – useCallback](https://react.dev/reference/react/useCallback)     |
| `useMemo`                     | [react.dev – useMemo](https://react.dev/reference/react/useMemo)             |
| `useRef`                      | [react.dev – useRef](https://react.dev/reference/react/useRef)               |
| Context API (`createContext`) | [react.dev – createContext](https://react.dev/reference/react/createContext) |

### 🪝 Custom Hooks

| Topic                                      | Link                                                                                                                                |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Reusing Logic with Custom Hooks (Official) | [react.dev – Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)                                                 |
| Custom Hook Patterns & Best Practices      | [patterns.dev – Hooks Pattern](https://www.patterns.dev/react/hooks-pattern/)                                                       |
| Mastering Custom Hooks (Deep Dive)         | [dev.to – Austin W Digital](https://dev.to/austinwdigital/mastering-custom-react-hooks-best-practices-for-clean-scalable-code-40b1) |
| Community Hook Library (usehooks.com)      | [usehooks.com](https://usehooks.com/)                                                                                               |

### 🔄 TanStack Query (React Query v5)

| Topic                             | Link                                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Official Docs – Overview          | [tanstack.com/query/v5](https://tanstack.com/query/v5/docs/framework/react/overview)                              |
| Installation & Quick Start        | [tanstack.com – Quick Start](https://tanstack.com/query/v5/docs/framework/react/quick-start)                      |
| `useQuery` Reference              | [tanstack.com – useQuery](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery)                  |
| `useMutation` Reference           | [tanstack.com – useMutation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation)            |
| Query Keys Guide                  | [tanstack.com – Query Keys](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys)                 |
| Optimistic Updates                | [tanstack.com – Optimistic Updates](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates) |
| QueryClient (`invalidateQueries`) | [tanstack.com – QueryClient](https://tanstack.com/query/v5/docs/reference/QueryClient)                            |
| `staleTime` / `gcTime` Explained  | [tanstack.com – Caching](https://tanstack.com/query/v5/docs/framework/react/guides/caching)                       |
| TanStack Query Devtools           | [tanstack.com – Devtools](https://tanstack.com/query/v5/docs/framework/react/devtools)                            |

### 🌐 Axios & HTTP

| Topic                               | Link                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| Axios Official Docs                 | [axios-http.com/docs/intro](https://axios-http.com/docs/intro)                  |
| Axios Instance & Config             | [axios-http.com – Config Defaults](https://axios-http.com/docs/config_defaults) |
| Axios Request Config                | [axios-http.com – Request Config](https://axios-http.com/docs/req_config)       |
| File Upload with `onUploadProgress` | [axios-http.com – Multipart Bodies](https://axios-http.com/docs/multipart)      |

### 🔐 JWT Authentication

| Topic                                         | Link                                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| JWT Introduction (jwt.io)                     | [jwt.io/introduction](https://jwt.io/introduction/)                                                          |
| JWT Auth in React + React Router (full guide) | [dev.to – Sanjay TTG](https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03)           |
| Adding JWT Auth to React (Clerk Blog)         | [clerk.com – JWT Auth](https://clerk.com/blog/adding-jwt-authentication-to-react)                            |
| localStorage vs Cookie token storage          | [developer.mozilla.org – localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) |

### 🛡️ Error Boundaries

| Topic                                  | Link                                                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Error Boundaries (Official React Docs) | [react.dev – Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) |
| `react-error-boundary` Package (npm)   | [npmjs.com – react-error-boundary](https://www.npmjs.com/package/react-error-boundary)                                       |
| Error Boundaries with React Router     | [reactrouter.com – Error Boundaries](https://reactrouter.com/how-to/error-boundary)                                          |

### ⏱️ Debouncing & Performance

| Topic                                 | Link                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `useDebounce` Hook (usehooks.com)     | [usehooks.com – useDebounce](https://usehooks.com/usedebounce)                                    |
| Debouncing Explained (MDN setTimeout) | [developer.mozilla.org – setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) |
| React Performance Optimization        | [react.dev – Render & Commit](https://react.dev/learn/render-and-commit)                          |

### 📦 Package Registries & Tooling

| Tool                           | Link                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `@tanstack/react-query` on npm | [npmjs.com – @tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query) |
| `axios` on npm                 | [npmjs.com – axios](https://www.npmjs.com/package/axios)                                 |
| `react-error-boundary` on npm  | [npmjs.com – react-error-boundary](https://www.npmjs.com/package/react-error-boundary)   |
| Vite (frontend build tool)     | [vitejs.dev](https://vitejs.dev/)                                                        |

---

Good luck! Remember to commit your work frequently and ask questions when stuck.
