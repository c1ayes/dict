import { useState } from "react";
import { useAuthContext } from "./AuthProvider"

function Login(){
    const {login} = useAuthContext();
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await login(username, password)
    }
    return(
        <div>
            <h1>Войти</h1>
            <form onSubmit={handleSubmit} className="flex flex-col h-screen justify-center items-center">
                <div>
                    <label htmlFor="username">Логин:</label>
                    <input type="text" name="username" id="username" value={username} onChange={(e) => (setUsername(e.target.value))} className="border p-1 m-2"/>
                </div>

                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e) => (setPassword(e.target.value))} className="border p-1 m-2"/>
                </div>
                <button type="submit">Отправить</button>
            </form>
        </div>
    )
    

}

export default Login