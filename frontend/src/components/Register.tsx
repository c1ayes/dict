import { useState } from "react"
import type { FormErrors, FormType } from "../types/RegisterTypes";
import { useNavigate } from "react-router-dom";

function Register(){
    const [form, setForm] = useState<FormType>({login:'', password:''});
    const [formErrors, setFormErrors] = useState<FormErrors>();
    const navigate = useNavigate();

    const validate = (data:FormType) => {
        const newErrors:FormErrors = {};
        if (!data.login.trim()){
            newErrors.login = "Login is required"
        }
        if (!data.password.trim()){
            newErrors.password = "Password is required"
        } else if (data.password.length < 8){
            newErrors.password = "Password's length is less than 8 symbols"
        }
        return newErrors
    }


    const fetchRegistration = async(data: FormType) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/register/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.login,
                    password: data.password
                })
            });

            if (!response.ok){
                const res = await response.json();
                console.log(res)
                setFormErrors(prev => ({...prev, login: res.username?.[0]}))
                return
            }

            setForm({login:'', password:''})
            navigate('/login')

        } catch (error){
            console.log(error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]:value}));
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validate(form);
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length > 0){
            return
        }
        await fetchRegistration(form);
    }

    return(
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col h-screen justify-center items-center">

                <div>
                    <label htmlFor="login">Логин:</label>
                    <input type="text" name="login" id="login" value={form.login} onChange={handleChange} className="border p-1 m-2"/>
                    {formErrors?.login && <span>{formErrors.login}</span>}
                </div>

                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" name="password" id="password" value={form.password} onChange={handleChange} className="border p-1 m-2"/>
                    {formErrors?.password && <span>{formErrors.password}</span>}
                </div>
                <button type="submit">Отправить</button>

            </form>
        </div>
    )
}

export default Register