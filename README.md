# Phase 1: WSL, Git, & Frontend Basics

Welcome to Phase 1 of the Travel Memory App curriculum! In this phase, you are focusing solely on the **Frontend React Single Page Application (SPA)**. The backend logic has been temporarily stripped—you will build that in Phase 2.

## 🛠️ The Ultimate Goal
Your job is to fix the entirely broken frontend Application. We have refactored the project into a proper Component Architecture (`frontend/src/components/`), separating the App into `Login`, `Register`, `Upload`, and `Gallery` components.

We have stripped out all the React `useState` hooks, the authentication form handlers, and the `axios` fetch calls.

However, we left the **JSX** (the HTML-like structure) mostly intact! Follow the extensive `// TODO:` comments inside `App.jsx` and each component file to safely rebuild the frontend flow and learn how to pass state via `props`.

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

## 📚 The Lesson Concepts

### 1. React Single Page Applications (SPAs)
Unlike traditional websites that reload the entire browser page when you click a link, **SPAs** use JavaScript to manipulate the DOM (Document Object Model) instantly. React achieves this using a **Virtual DOM**, making state changes incredibly fast without annoying page refreshes.

### 2. Form Control with `useState`
In React, forms should be "Controlled Components". This means the data in the form is directly tied to a React state variable (`useState`), rather than relying on the HTML `<input>` elements holding their own invisible state.
- [React Documentation on `useState`](https://react.dev/reference/react/useState)
- [React Documentation on Form Elements](https://react.dev/reference/react-dom/components/input)

### 3. Session Management with JWTs
When a user logs in, the backend sends a **JSON Web Token (JWT)**. To keep the user logged in even if they refresh the page, we need to save this token locally in the browser. 
We use the native `localStorage` API to acheive this:
```javascript
localStorage.setItem('token', 'eyJhbGciOi...');
const savedToken = localStorage.getItem('token');
```
You will configure Axios to automatically attach this token to every outgoing `fetch` request using interceptors.

### 4. Making API Calls
You'll use `axios` (or standard `fetch`) to communicate with the REST API. When making HTTP `POST` requests, you'll pass dynamic JavaScript objects. When dealing with Files (like uploading images), you'll need to wrap them in a native `FormData` object.
- [MDN Fetch API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN FormData Reference](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

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
