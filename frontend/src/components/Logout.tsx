import { useAuthContext } from "./AuthProvider";

export function Logout(){
    const {logout} = useAuthContext();
    return(
        <div>
            <button onClick={() => (logout())}>Выйти</button>
        </div>
    ) 
}