import { useEffect, useState } from "react"

function Translate() {
  const [text, setText] = useState<string>('')
  const [lang, setLang] = useState<'ru' | 'en'>('en')
  const tolang = lang === 'ru' ? 'en' : 'ru'
  const [translated, setTranslated] = useState<string>('')



  useEffect(() => {
    if (!text.trim()) {
      setTranslated('')
      return
    }
    const timeout = setTimeout(() => {
      const send = async() => {
        const data = {'text': text, 'from_lang': lang, 'to_lang':tolang}
        try {
          const response = await fetch('http://127.0.0.1:8000/api/translate/', {
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
          })
          const result = await response.json();
          setTranslated(result.translation)
        } catch (error) {
          console.log('error', error)
          }
      }
      send()
    }, 300)

    return () => clearTimeout(timeout) 
  }, [text,lang,tolang ])


  const save = async () => {
    if (!text.trim()){
      return
    }
    const data = lang === "ru" ? {'original': text, 'translated':translated} : {'original':translated, 'translated': text} 
    try {
      const response = await fetch('http://127.0.0.1:8000/api/save/', {
        method:'POST',
        headers:{
          'Content-Type':'application/json' 
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        console.log('Ошибка при сохранении:', response.status);
      }
    } catch (error) {
      console.log(error)
    } 
  }



  return(
    <div className='flex justify-center items-center min-h-screen'>

      <div className='flex  gap-20 text-xl '>


        <div className='flex flex-col'>
          <select value={lang} onChange={(e) => {setLang(e.target.value as 'ru' | 'en')}} className='bg-[#365d97] p-1 w-50 rounded-2xl'>
            <option value="ru">Русский</option>
            <option value="en">Английский</option>
          </select>

          <input id="text" type="text" value={text} onChange={(e) => {setText(e.target.value)}} className='bg-blue-100 text-black mt-2 rounded-2xl p-2' autoComplete="off"/>
        </div>

        <div className='flex flex-col'>
          <select value={tolang} className='bg-[#365d97] p-1 w-50 rounded-2xl' disabled={true}>
              <option value="ru">Русский</option>
              <option value="en">Английский</option>
          </select>
          <div className="bg-blue-100 text-black mt-2 rounded-2xl min-h-10 min-w-40 p-4">
            {translated}
          </div>
          <button className='bg-[#1f263d] text-white rounded-2xl ml-[50px] p-1 hover:bg-[#6441b6] m-1 active:scale-90 transition' onClick={() => {save()}}>Сохранить</button>
        </div>


      </div>
    </div>
  )
}

export default Translate