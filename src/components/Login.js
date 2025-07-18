import React, { useEffect, useState } from 'react';
// Assuming apiService is correctly configured to handle API calls
import apiService from '../services/ApiServices'; // Adjusted path to apiService
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

function LoginPage() {
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('student'); // Default to 'student'
    const navigate = useNavigate(); // Initialize useNavigate hook for programmatic navigation

    const handleLogin = async () => {
        // Simple validation without displaying error messages
        if (!name.trim()) {
            console.log('Please enter your name.');
            return;
        }

        try {
            // Make the API call using apiService.post
            // Ensure your backend expects 'name' and 'user_type' in the payload
            const response = await apiService.post('/api/user/create', { name, user_type: userType });

            if (response) { // Assuming the API returns { success: true, id: 'someUserId' } on success
                // Store user data in localStorage after stringifying the object
                localStorage.setItem("user", JSON.stringify({ userId: response.id, user_type: userType, name : name }));
                console.log(`Login successful! User ID: ${response.id}, User Type: ${userType}`);

                // Navigate to the /rooms page
                window.location.href = '/roomlist';
            } else {
                // Handle API response indicating failure (console log for simplicity)
                console.log(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred during login API call:', error);
            console.log('Login failed due to network error or unexpected response.');
        }
    };
    useEffect(() => { localStorage.removeItem("user");}, []); // Empty dependency array to run once on component mount

    // --- Inline Styles ---
    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa', // bg-gray-100 equivalent
        padding: '1rem', // p-4 equivalent
        fontFamily: 'Inter, sans-serif',
    };

    const cardStyle = {
        backgroundColor: '#fff',
        padding: '2rem', // p-8 equivalent
        borderRadius: '0.5rem', // rounded-lg equivalent
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl equivalent
        width: '100%',
        maxWidth: '24rem', // max-w-sm equivalent
    };

    const titleStyle = {
        fontSize: '1.875rem', // text-3xl equivalent
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1f2937', // text-gray-800 equivalent
        marginBottom: '2rem', // mb-8 equivalent
    };

    const inputGroupStyle = {
        marginBottom: '1.25rem', // mb-5 equivalent
    };

    const labelStyle = {
        display: 'block',
        color: '#374151', // text-gray-700 equivalent
        fontSize: '0.875rem', // text-sm equivalent
        fontWeight: '600', // font-semibold equivalent
        marginBottom: '0.5rem', // mb-2 equivalent
    };

    const inputStyle = {
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow equivalent
        appearance: 'none',
        border: '1px solid #d1d5db', // border equivalent
        borderRadius: '0.375rem', // rounded-md equivalent
        width: '100%',
        padding: '5px', // py-3 equivalent        
       
        outline: 'none', // focus:outline-none equivalent
        // focus:ring-2 focus:ring-blue-500 focus:border-transparent - these are complex for inline
        // and would typically require a stylesheet or CSS-in-JS
    };

    const selectGroupStyle = {
        marginBottom: '1.5rem', // mb-6 equivalent
    };

    const buttonContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const buttonStyle = {
        backgroundColor: '#2563eb', // bg-blue-600 equivalent
        color: '#fff', // text-white equivalent
        fontWeight: 'bold',
        paddingTop: '0.75rem', // py-3 equivalent
        paddingBottom: '0.75rem',
        paddingLeft: '1.5rem', // px-6 equivalent
        paddingRight: '1.5rem',
        borderRadius: '0.375rem', // rounded-md equivalent
        outline: 'none', // focus:outline-none equivalent
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // focus:shadow-outline equivalent
        transition: 'background-color 0.3s ease, transform 0.2s ease', // transition duration-300 ease-in-out transform
        cursor: 'pointer',
        border: 'none',
        // hover:bg-blue-700 hover:scale-105 - these require actual CSS for hover states
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Login</h2>

                <div style={inputGroupStyle}>
                    <label htmlFor="name" style={labelStyle}>
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        style={inputStyle}
                    />
                </div>

                <div style={selectGroupStyle}>
                    <label htmlFor="userType" style={labelStyle}>
                        User Type:
                    </label>
                    <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>

                <div style={buttonContainerStyle}>
                    <button
                        type="button"
                        onClick={handleLogin}
                        style={buttonStyle}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
