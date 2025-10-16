import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    

    useEffect(() => {
        // Check localStorage on component mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('userData');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
       
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};