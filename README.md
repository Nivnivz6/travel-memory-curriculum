# Phase 1: WSL, Git, & Frontend Basics

Welcome to Phase 1 of the Travel Memory App curriculum! In this phase, you are focusing solely on the **Frontend React Single Page Application (SPA)**. The backend logic has been temporarily stripped—you will build that in Phase 2.

## 🛠️ The Ultimate Goal
Your job is to fix the entirely broken frontend Application. We have refactored the project into a proper Component Architecture (`frontend/src/components/`), separating the App into `Login`, `Register`, `Upload`, and `Gallery` components.

We have stripped out all the React `useState` hooks, the authentication form handlers, and the `axios` fetch calls.

However, we left the **JSX** (the HTML-like structure) mostly intact! Follow the extensive `// TODO:` comments inside the following files to safely rebuild the frontend flow and learn how to pass state via `props`:

- `frontend/src/App.jsx`
- `frontend/src/components/Login.jsx`
- `frontend/src/components/Register.jsx`
- `frontend/src/components/Upload.jsx`
- `frontend/src/components/Gallery.jsx`

## 📚 The Lesson Concepts

### 1. React Single Page Applications (SPAs)
Traditional websites reload the entire page every time you click a link or submit a form. This requires the server to send a fresh HTML document every time, making the internet feel slow and clunky. 

**React SPAs** are different. Only one single HTML page is ever sent to the browser (`index.html`). After that, React uses JavaScript to instantly swap out "Components" (like Lego blocks) directly in the browser's Document Object Model (DOM). It uses a **Virtual DOM** to figure out the exact minimal changes needed, making state changes lightning fast without annoying full-page refreshes. 

### 2. Form Control with `useState`
In pure HTML, an `<input>` field holds its own state. If you type "Hello", the DOM remembers "Hello". However, React hates this because React wants to be the single source of truth for all data in your app.

We solve this using **Controlled Components** with the `useState` hook. Every time the user types a single character, we update a React state variable, and force the input to read its value *from* that state variable.

*Example:*
```javascript
import { useState } from 'react';

// Inside your component:
const [email, setEmail] = useState('');

// The input 'value' is locked to the React state. 
// The 'onChange' fires on every keystroke to update the state.
<input 
  type="email" 
  value={email} 
  onChange={(e) => setEmail(e.target.value)} 
/>
```
- [React Documentation on `useState`](https://react.dev/reference/react/useState)
- [React Documentation on Form Elements](https://react.dev/reference/react-dom/components/input)

### 3. Side Effects with `useEffect`
While `useState` handles data that changes *inside* your component triggered by a user, `useEffect` handles side-effects that happen *outside* your component, such as fetching data from a backend server when a component first loads.

*Example:*
```javascript
import { useEffect } from 'react';

// The useEffect takes a function to run, and an array of "dependencies"
useEffect(() => {
  // This code will run when the component first mounts to the screen
  fetchSomeData();
}, []); // An empty array means "Run this only ONCE when the component loads"
```

If you put a state variable in the array (e.g., `[token]`), React will re-run the `useEffect` automatically every single time the `token` changes! 
- [React Documentation on `useEffect`](https://react.dev/reference/react/useEffect)

### 4. Session Management with JWTs
When a user logs in, HTTP is inherently "stateless"—the server forgets who you are the moment it responds. To remember the user, the backend generates a **JSON Web Token (JWT)**, which acts like a secure digital wristband or hotel keycard.

To stay logged in after refreshing the page, the React app must save this wristband in the browser's local memory. We use the native `localStorage` API to achieve this:

*Example:*
```javascript
// Saving the token after a successful login
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5...');

// Retrieving the token when the app first loads
const savedToken = localStorage.getItem('token');
```

You are responsible for saving this token upon login/register, and deleting it upon logout via `localStorage.removeItem('token')`.

### 5. Making API Calls with Axios
Your frontend needs to talk to the backend. While modern browsers have the native `fetch()` API, developers overwhelmingly prefer **Axios** because it automatically parses JSON data and has cleaner syntax.

*Example of a standard POST request:*
```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'test@test.com',
  password: 'password123'
});
console.log(response.data.token); // The JWT!
```

*Example of uploading files:*
You cannot send a raw image file as JSON. You must wrap it in a native `FormData` object!
```javascript
const formData = new FormData();
formData.append('image', myImageFile);

// Note the special headers required for files
await axios.post('http://localhost:3000/api/images/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```
- [MDN FormData Reference](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

### 6. Data Isolation (Tenant Privacy)
A real-world application is useless if everyone can see everyone else's private files! 

When you ask the backend for "My Uploaded Images", the backend needs proof of *who you are*. You provide this proof by attaching your JWT "wristband" to the specific GET request via an `Authorization` header.

*Example:*
```javascript
const token = localStorage.getItem('token');
const response = await axios.get('http://localhost:3000/api/images', {
  headers: { Authorization: `Bearer ${token}` }
});
```

This ensures the backend queries the database using your specific User ID (`Image.find({ userId: req.user._id })`), meaning you ONLY get your personal images returned. This critical security concept is called **Tenant Isolation**.

## 💻 Prerequisites & Environment Setup
If you are on Windows, you **MUST** use WSL (Windows Subsystem for Linux) to ensure a standard Unix-like development environment.

### 1. Install WSL (Windows 11)
Open **PowerShell as an Administrator** and run:
```powershell
wsl --install
```
Restart your computer. Upon reboot, an Ubuntu terminal will open. Create your UNIX username and password.

### 2. Docker Desktop
1. Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/).
2. In Docker Settings -> Resources -> WSL Integration, ensure integration is enabled for your default WSL distro (`Ubuntu`).

### 3. VS Code Setup
1. Open VS Code in Windows.
2. Install the **WSL extension** by Microsoft.
3. Open your project folder using the bottom left green `><` button -> "Reopen in WSL".

## 🧪 Test-Driven Development (TDD)
We have provided a robust frontend testing suite using **Vitest** and **React Testing Library**. Right now, all tests fail because `App.jsx` is hollowed out.

Your assignment is to write code in `App.jsx` and the components in `src/components/` until all tests pass!

### How to Run Your Assignment:
```bash
# Move into the frontend directory
cd frontend

# Install the dependencies
npm install

# Run the TDD Watcher
npm run test:watch
```

Keep your terminal open. Every time you save a component file, Vitest will instantly re-run the tests. Read the failing error messages closely—they tell you exactly what is missing!

Good luck!
