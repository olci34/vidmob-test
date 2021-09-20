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
    const strArr = seperate(str, "+")
    const intArr = strArr.map(str => splitByMinusAndCalculate(str))  
    const result = intArr.reduce((acc, no) => acc + no)
    return result
}

function splitByMinusAndCalculate(str) {
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
    const intArr = strArr.map(str => splitByTimeAndCalculate(str))
    const result = intArr.reduce((acc, no) => acc - no)
    return parseInt(result)
}

function splitByTimeAndCalculate(str) {
    const strArr = seperate(str, "*")
    const intArr = strArr.map(str => splitByDivideAndCalculate(str))
    const result = intArr.reduce((acc, no) => acc * no)
    return result
}

function splitByDivideAndCalculate(str) {
    const strArr = seperate(str, "/")
    const intArr = strArr.map(str => parseInt(str))
    const result = intArr.reduce((acc, no) => acc / no)
    return result
}

function seperate(str, operator) {
    let res = []
    let parantheses = 0
    let el = ""

    for (let i=0; i < str.length; i++) {
        let currChar = str[i]
        if (currChar === "(") parantheses++
        if (currChar === ")") parantheses--
        if (parantheses === 0 && operator === currChar) {
            res.push(el)
            el = ""
        } else {
            el += currChar
        }
    }

    if (el !== "") {
        res.push(el)
    }

    return res;
}

export default Calculate