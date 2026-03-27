import { useEffect, useState } from "react"
import { useAuthContext } from "./AuthProvider";

function Essay(){
    const [theme, setTheme] = useState<string>();
    const [words, setWords] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {authFetch} = useAuthContext();

    useEffect(() => {
        const wordsFetch = async () => {
            try {
                const response = await authFetch('http://localhost:8000/api/essay/');
                const data = await response.json();
                if (!data){
                    return 'Ошибка с получением данных'
                }
                setTheme(data.random_theme);
                setWords(data.randomCommonWords);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }
        wordsFetch()
    }, [])

    if (loading){
        return(
            <div>
                <h1>Загрузка...</h1>
            </div>
        )
    }

    return(
        <div>
            <div>
                Тема: {theme}
                Обычные слова:
                <ul>
                    {words.map(word => (
                        <li>
                            {word}
                        </li>
                    ))}
                </ul>
            </div>
            
            <textarea className="h-[500px] w-[500px]"></textarea>

        </div>
    )
}

export default Essay