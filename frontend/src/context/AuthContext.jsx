"import React, { createContext, useContext, useEffect, useState } from \"react\";
import api from \"@/lib/api\";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null = checking, false = unauth, object = user
    useEffect(() => {
        api.get(\"/auth/me\").then((r) => setUser(r.data)).catch(() => setUser(false));
    }, []);
    const login = async (email, password) => {
        const { data } = await api.post(\"/auth/login\", { email, password });
        setUser(data);
        return data;
    };
    const register = async (payload) => {
        const { data } = await api.post(\"/auth/register\", payload);
        setUser(data);
        return data;
    };
    const logout = async () => {
        try { await api.post(\"/auth/logout\"); } catch (e) {}
            setUser(false);
        };
        return <AuthCtx.Provider value={{ user, setUser, login, register, logout }}>{children}</AuthCtx.Provider>;
    }

    export function useAuth() { return useContext(AuthCtx); }
    "