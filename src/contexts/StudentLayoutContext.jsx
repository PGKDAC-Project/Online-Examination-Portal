// src/contexts/StudentLayoutContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const StudentLayoutContext = createContext();

// Custom hook to use the layout context
export const useStudentLayout = () => {
    return useContext(StudentLayoutContext);
};

// 2. Create the Provider Component
export const StudentLayoutProvider = ({ children }) => {
    // Sidebar toggle state
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);

    // Theme state (default to 'light' or load from localStorage)
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme ? storedTheme : 'light';
    });

    // Effect to apply theme class to body and save to localStorage
    useEffect(() => {
        document.body.className = theme; // Apply class to body for global styling
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleSidebar = () => {
        setIsSidebarToggled(prevState => !prevState);
    };

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const contextValue = {
        isSidebarToggled,
        toggleSidebar,
        theme,
        changeTheme,
    };

    return (
        <StudentLayoutContext.Provider value={contextValue}>
            {children}
        </StudentLayoutContext.Provider>
    );
};