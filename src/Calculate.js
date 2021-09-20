import { useState } from 'react'

function Calculate() {

    const [input, setInput] = useState("")
    const [result, setResult] = useState("")
    const handleChange = (e) => { setInput(e.target.value) }
    const handleCalculateButton = () => { 
        let result = splitByPlusAndCalculate(input) 
        setResult(result)
    }

    return (
        <div>
            <input type="text" value={input} onChange={handleChange}></input>
            <button onClick={handleCalculateButton}>Calculate</button>
            <h3> Result: {result} </h3>
        </div>
    )
}

function splitByPlusAndCalculate(str) {
    const strArr = str.split("+")
    const intArr = strArr.map(str => parseInt(str))
    const result = intArr.reduce((acc, no) => acc + no)
    return result
}

export default Calculate