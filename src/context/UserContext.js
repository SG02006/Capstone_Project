import React, { createContext, useState, useEffect, useMemo } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user')) || null;

    });
    

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);

    const contextValue = useMemo(() => ({ user, login, logout }), [user]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };