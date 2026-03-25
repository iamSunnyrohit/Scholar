import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        api.get("/auth/me")
            .then((data) => setUser(data))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const data = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (name, email, password) => {
        const data = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const updateProfile = async (name, email) => {
        const data = await api.patch("/auth/profile", { name, email });
        setUser(data);
        return data;
    };

    const updatePassword = async (currentPassword, newPassword) => {
        return await api.patch("/auth/password", { currentPassword, newPassword });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
