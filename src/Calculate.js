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
    const intArr = strArr.map(str => splitByMinusAndCalculate(str))  
    const result = intArr.reduce((acc, no) => acc + no)
    return result
}
// 6-15--5*-4-35
//   s  s    js
// ij
//33
//ij
function splitByMinusAndCalculate(str) { // -5--2
    if (Number(str)) return parseInt(str)
    const strArr = []
    let s = 0
    for (let j=0; j < str.length; j++) {
        if (j === str.length-1) strArr.push(str.substring(s,j+1))
        if (str[j] === "-" && Number(str[j-1])) {
            if (j > s) {
                strArr.push(str.substring(s,j))
                s = j+1
            }
        }
    }
    const intArr = strArr.map(str => parseInt(str))
    const result = intArr.reduce((acc, no) => acc - no)
    return parseInt(result)
}

function splitByTimeAndCalculate(str) {
    const strArr = str.split("*")
    const intArr = strArr.map(str => parseInt(str))
    const result = intArr.reduce((acc, no) => acc * no)
    return result
}

export default Calculate