import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'Admin User', email: 'admin@example.com' };
    });
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        // Just ensure user is in localStorage
        if (!localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (!localStorage.getItem('token')) {
            localStorage.setItem('token', 'mock-token');
        }
    }, [user]);

    const login = async (email, password) => {
        const mockUser = { name: 'Admin User', email: email || 'admin@example.com' };
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success('Welcome back!');
        return { success: true };
    };

    const register = async (userData) => {
        const mockUser = { ...userData, name: userData.name || 'Admin' };
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        return { success: true };
    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(true); // Keep it true contextually or handle redirection
        toast.success('Logged out successfully');
    };

    const updateProfile = async (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Profile updated successfully');
        return { success: true };
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

