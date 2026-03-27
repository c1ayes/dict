import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    accessToken: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    authFetch: (url: string, options?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<null | AuthContextType>(null)

export function AuthProvider({children}: {children: React.ReactNode}){
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const isRefreshing = useRef(false);
    const navigate = useNavigate();

    const login = async(username:string, password:string) => {
        const response = await fetch('http://localhost:8000/api/auth/login/', {
            headers:{
                'Content-type': 'application/json'
            },
            method:"POST",
            body: JSON.stringify({username, password})
        });
        if (!response.ok){
            throw new Error("Неверный логин или пароль")
        }
        const data = await response.json();
        setAccessToken(data.access);
        localStorage.setItem('refresh', data.refresh);
        
        setTimeout(()=>{
            navigate('/');
        }, 100)
        
    }

    const logout = async() => {
        const refresh = localStorage.getItem('refresh')
        await fetch('http://localhost:8000/api/auth/logout/', {
            headers: {'Content-type': 'application/json'},
            method: "POST",
            body: JSON.stringify({refresh})
        });
        setAccessToken(null);
        localStorage.removeItem('refresh');
        navigate("/login")
    }
    
    const refreshAccessToken = async () => {
        if (isRefreshing.current) return;

        const refresh = localStorage.getItem('refresh');
        if (!refresh) return;

        try {
            isRefreshing.current = true; 

            const response = await fetch('http://localhost:8000/api/auth/refresh/', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ refresh })
            });

            if (!response.ok) {
                logout();
                return;
            }

            const data = await response.json();
            setAccessToken(data.access);

            if (data.refresh) {
                localStorage.setItem('refresh', data.refresh);
            }

            return data.access;
        } finally {
            isRefreshing.current = false; 
        }
    }

    const authFetch = async(url: string, options: RequestInit = {}) => {
        const response = await fetch(url, {
            ...options,
            headers:{
                ...options.headers,
                'Content-type':'application/json',
                'Authorization':`Bearer ${accessToken}`
            }
        })
        if (response.status === 401){
            const newToken = await refreshAccessToken();
            if(!newToken){
                navigate('/login');
                return response
            }
            return fetch(url, {
            ...options,
            headers:{
                ...options.headers,
                'Authorization':`Bearer ${newToken}`
            }
        })
        }

        return response
    }

    useEffect(() => {
        const refresh = localStorage.getItem('refresh')
        if (refresh){
            refreshAccessToken()
        }
    }, [])
    return(
        <AuthContext.Provider value={{accessToken, login,logout, authFetch}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () =>{
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("You are outside of Provide");
    return ctx
}