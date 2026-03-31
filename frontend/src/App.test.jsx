// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import axios from 'axios';
// import App from './App';
// import { vi } from 'vitest';

// // Mock axios so we don't make real network requests
// vi.mock('axios');

// describe('Travel Memory App Authentication Flow', () => {
//   beforeEach(() => {
//     // Clear localStorage and mocks before each test
//     localStorage.clear();
//     vi.clearAllMocks();
//   });

//   test('1. Renders the initial Login App structure', () => {
//     render(<App />);
//     expect(screen.getByText(/Travel Memory App/i)).toBeInTheDocument();
    
//     // It should render the Login Form initially
//     expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    
//     // Email and Password inputs should be visible
//     expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
//   });

//   test('2. Allows a user to type into the form inputs', async () => {
//     render(<App />);
//     const emailInput = screen.getByPlaceholderText(/Email Address/i);
//     const passwordInput = screen.getByPlaceholderText(/Password/i);

//     // Simulate typing
//     await userEvent.type(emailInput, 'student@example.com');
//     await userEvent.type(passwordInput, 'secret123');

//     // The component state should update, reflecting the typed values
//     expect(emailInput).toHaveValue('student@example.com');
//     expect(passwordInput).toHaveValue('secret123');
//   });

//   test('3. Submitting the Login form calls axios.post with correct payload', async () => {
//     // Mock successful authentication response
//     axios.post.mockResolvedValueOnce({
//       data: {
//         token: 'fake-jwt-token-from-backend',
//         _id: '123',
//         username: 'student',
//         email: 'student@example.com'
//       }
//     });

//     // Mock successful images GET response after login
//     axios.get.mockResolvedValueOnce({
//       data: []
//     });

//     render(<App />);

//     const emailInput = screen.getByPlaceholderText(/Email Address/i);
//     const passwordInput = screen.getByPlaceholderText(/Password/i);

//     // Simulate typing
//     await userEvent.type(emailInput, 'student@example.com');
//     await userEvent.type(passwordInput, 'secret123');

//     // Submit form
//     const submitBtn = screen.getByRole('button', { name: /Login|Submit/i });
//     fireEvent.click(submitBtn);

//     // Verify axios was called to the login route with correctly mapped state
//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/auth/login', {
//         email: 'student@example.com',
//         password: 'secret123'
//       });
//     });
//   });

//   test('4. Successful login stores the token in localStorage', async () => {
//     axios.post.mockResolvedValueOnce({
//       data: {
//         token: 'super-secret-jwt',
//         user: { username: 'student' }
//       }
//     });
    
//     // Because we mock success, the next step is automatically fetching images
//     axios.get.mockResolvedValueOnce({ data: [] });

//     render(<App />);

//     await userEvent.type(screen.getByPlaceholderText(/Email Address/i), 'student@example.com');
//     await userEvent.type(screen.getByPlaceholderText(/Password/i), 'secret123');
//     fireEvent.click(screen.getByRole('button', { name: /Login|Submit/i }));

//     // Wait for the auth logic to complete
//     await waitFor(() => {
//       expect(localStorage.getItem('token')).toBe('super-secret-jwt');
//     });
//   });
// });
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';
import { vi } from 'vitest';

// Mock axios so we don't make real network requests
vi.mock('axios');

describe('Travel Memory App Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('1. Renders the initial Login App structure', () => {
    render(<App />);
    expect(screen.getByText(/Travel Memory App/i)).toBeInTheDocument();
    
    // It should render the Login Form initially
    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    
    // Email and Password inputs should be visible
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  test('2. Allows a user to type into the form inputs', async () => {
    render(<App />);
    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    // Simulate typing
    await userEvent.type(emailInput, 'student@example.com');
    await userEvent.type(passwordInput, 'secret123');

    // The component state should update, reflecting the typed values
    expect(emailInput).toHaveValue('student@example.com');
    expect(passwordInput).toHaveValue('secret123');
  });

  test('3. Submitting the Login form calls axios.post with correct payload', async () => {
    // Mock successful authentication response
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-jwt-token-from-backend',
        _id: '123',
        username: 'student',
        email: 'student@example.com'
      }
    });

    // Mock successful images GET response after login
    axios.get.mockResolvedValueOnce({
      data: []
    });

    render(<App />);

    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    // Simulate typing
    await userEvent.type(emailInput, 'student@example.com');
    await userEvent.type(passwordInput, 'secret123');

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Login|Submit/i });
    fireEvent.click(submitBtn);

    // Verify axios was called to the login route with correctly mapped state
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/auth/login', {
        email: 'student@example.com',
        password: 'secret123'
      });
    });
  });

  test('4. Successful login stores the token in localStorage', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'super-secret-jwt',
        user: { username: 'student' }
      }
    });
    
    // Because we mock success, the next step is automatically fetching images
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/Email Address/i), 'student@example.com');
    await userEvent.type(screen.getByPlaceholderText(/Password/i), 'secret123');
    fireEvent.click(screen.getByRole('button', { name: /Login|Submit/i }));

    // Wait for the auth logic to complete
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('super-secret-jwt');
    });
  });
});