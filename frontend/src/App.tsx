import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Translate from "./components/Translate.tsx"
import Dictionary from "./components/Dictionary.tsx"
import Essay from "./components/Essay.tsx"
import Register from "./components/Register.tsx"
import Login from "./components/Login.tsx"
import { AuthProvider, useAuthContext } from "./components/AuthProvider.tsx"
import { Logout } from "./components/Logout.tsx"

function AppContent() {
  const {accessToken} = useAuthContext();
  return(

        <div>
        <nav className="p-2 text-xl flex justify-center gap-7 ">
          <Link to={'/'}>Главная</Link>
          <Link to={'/dictionary'}>Словарь</Link>
          <Link to={'/essay'}>Эссе</Link>
          {!accessToken ?
          <div className="flex gap-7">
                  <Link to={'/register'}>Зарегестрироваться</Link>
                  <Link to={'/login'}>Войти</Link>
          </div>
          :
          <Logout/>
          }

        </nav>
        <Routes>
            <Route path="/" element={<Translate/>}></Route>
            <Route path="/dictionary" element={<Dictionary/>}></Route>
            <Route path="/essay" element={<Essay/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
        </Routes>
        </div>
  )
}

function App(){
  return(
  <BrowserRouter>
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  </BrowserRouter>
  )
}

export default App
