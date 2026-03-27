import { useEffect, useState } from "react"
import { useAuthContext } from "./AuthProvider"

interface Word{
    original:string
    translated:string
    id:number
}


function Dictionary(){
    const [words, setWords] = useState<Word[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [editing, setEditing] = useState<number | null>(null)
    const [neworiginal, setNeworiginal] = useState<string>('')
    const [newtranslated, setNewtranslated] = useState<string>('')
    const {authFetch} = useAuthContext();

    const deleteWord = async (id:number) =>{
        try {
            const response = await authFetch(`http://127.0.0.1:8000/api/delete/${id}/`, {
                method:"DELETE"
            })
            if (!response.ok){
                console.log("Error with deleting")
                return
            }
            setWords((prev) => (prev?.filter(word => word.id !== id)))
            console.log("Word was deleted")
        } catch (error) {
            console.log(error)
        }
    }

    const updateWord = async (id:number, newtext:string, newtranslated:string) => {
        const data = {'original': newtext, 'translated': newtranslated}
        try {
            const response = await authFetch(`http://127.0.0.1:8000/api/update/${id}/`, {
                method:"PATCH",
                headers:{
                    "Content-type": 'application/json'
                },
                body: JSON.stringify(data)
            })
            if(!response.ok){
                console.log("Error with updating")
                return
            }
            
            setWords(words?.map((word) => (word.id === id ? {...word, original: newtext ?? word.original, translated:newtranslated ?? word.translated}: word)))
            setEditing(null)

        } catch (error) {
            console.log(error)
        }
    }




    const saveWord = async() => {
        const data = {'original': neworiginal, 'translated':newtranslated}
        try {
            const response = await authFetch("http://127.0.0.1:8000/api/save/", {
                method:"POST",
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok){
                console.log("error with saving new word")
                return
            }
            const data_response:Word = await response.json()
            setWords((prev) => ([...prev, data_response]))
            setNeworiginal("")
            setNewtranslated("")
            
        } catch (error) {
            console.log(error)
        }
    }




    const updateOriginal = (id: number, newtext:string) => {
        setWords(words?.map(word => (word.id === id ? {...word, 'original': newtext} : word)))
    } 
    const updateTranslated = (id: number, newtext:string) => {
        setWords(words?.map(word => (word.id === id ? {...word, 'translated': newtext} : word)))
    } 

    useEffect(() => {
        const getWords = async() => {
            try {
                const response = await authFetch('http://127.0.0.1:8000/api/save/')
                if (!response.ok){
                    console.log("Ошибка")
                    return
                }
                const data = await response.json()
                setWords(data)
            } catch (error) {
                console.log(error)
            } finally{
                setLoading(false)
            }
        }
        getWords()
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
            <div className="flex justify-center items-center mt-5">
                <ul>
                    {words?.map((word) => (
                        <div key={word.id}>
                        {word.id === editing ? (
                            <li className="flex justify-between gap-5 items-center text-xl p-2 text-center">
                                <input type="text" className="bg-amber-300 rounded-2xl p-1.5 min-w-35 text-2xl text-center" value={word.translated} onChange={(e) => (updateOriginal(word.id, e.target.value))}/>
                                —
                                <input type="text" className="bg-indigo-400 rounded-2xl p-1.5 min-w-35 text-2xl text-center" value={word.original} onChange={(e) => (updateTranslated(word.id, e.target.value))}/>

                                <div>
                                    <button className=" bg-red-800 p-2 hover:bg-black hover:text-white transition text-sm mr-2 rounded-2xl" onClick={() => (updateWord(word.id, word.original, word.translated))}>Сохранить изменения</button>
                                    <button className="bg-blue-500 p-2 hover:bg-black hover:text-white transition text-sm ml-2 rounded-2xl" onClick={() => (setEditing(null))}>Отменить</button>
                                </div>
                            </li>
                        ) : 
                        
                        (
                            <li className="flex justify-between gap-5 items-center text-xl p-2 text-center">
                                <div className="bg-amber-300 rounded-2xl p-1.5 min-w-35 text-2xl">
                                    {word.translated}
                                </div>
                                 —
                                <div className="bg-indigo-400 rounded-2xl p-1.5 min-w-35 text-2xl">
                                    {word.original}
                                </div>

                                <div>
                                    <button className=" bg-red-800 p-2 hover:bg-black hover:text-white transition text-sm mr-2 rounded-2xl" onClick={() => (deleteWord(word.id))}>Удалить слово</button>
                                    <button className="bg-blue-500 p-2 hover:bg-black hover:text-white transition text-sm ml-2 rounded-2xl" onClick={() => (setEditing(word.id))}>Редактировать</button>
                                </div>
                            </li>
                        )}
                        </div>
                    ))}
                    <li className="flex justify-between gap-5 items-center text-xl p-2 text-center">
                        <div className="bg-amber-300 rounded-2xl p-1.5 min-w-35 text-2xl">
                            <input type="text" value={newtranslated} onChange={(e) => (setNewtranslated(e.target.value))}/>
                        </div>
                        —
                        <div className="bg-indigo-400 rounded-2xl p-1.5 min-w-35 text-2xl">
                            <input type="text" value={neworiginal} onChange={(e) => (setNeworiginal(e.target.value))}/>
                        </div>
                        <button className=" bg-green-600 p-2 hover:bg-black hover:text-white transition text-sm mr-2 rounded-2xl" onClick={() => (saveWord())}>Сохранить новое слово</button>
                    </li>
                </ul>
            </div>
        </div>
    )

}

export default Dictionary