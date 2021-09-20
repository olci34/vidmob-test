import { useState } from 'react'

function Calculate() {

    const [input, setInput] = useState("")
    const [result, setResult] = useState("")
    const handleChange = (e) => { setInput(e.target.value) }
    const handleCalculateButton = () => { console.log(input) }

    return (
        <div>
            <input type="text" value={input} onChange={handleChange}></input>
            <button onClick={handleCalculateButton}>Calculate</button>
            <h3> Result: {result} </h3>
        </div>
    )
}

export default Calculate