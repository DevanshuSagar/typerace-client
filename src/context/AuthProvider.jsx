import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import AuthService from "../services/authService";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                AuthService.setAuthToken(token);
                try {
                    const res = await AuthService.getCurrentUser();
                    setUser(res.data);
                } catch (err) {
                    console.error(err);
                    localStorage.removeItem("token");
                    AuthService.setAuthToken(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (token) => {
        localStorage.setItem("token", token);
        AuthService.setAuthToken(token);
        try {
            const res = await AuthService.getCurrentUser();
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user after login", err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        AuthService.setAuthToken(null);
        setUser(null);
    };

    const value = { user, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
