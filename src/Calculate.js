import { useState } from 'react'

function Calculate() {

    const [input, setInput] = useState("")
    const [result, setResult] = useState("")
    const handleChange = (e) => { setInput(e.target.value) }
    const handleCalculateButton = () => {
        const inputArr = input.match(/[\d*/+-/()]/g)
        if (!inputArr || inputArr.length !== input.length) {
            alert('Wrong Input. Please only use digits and +-*/() characters without any space')
        } else {
            let result = splitByPlusAndCalculate(input) 
            setResult(result)
        }
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
    if (!operatorsValid(str)) {
        return alert("You can't use more than 2 operators in series.\nThe second operator of a series can only be '-'.\nYou can't leave paranthesis open.\nYou can't start with operators expect it is a negative number.")
    }
    const strArr = customSplit(str, "+")
    const intArr = strArr.map(str => splitByMinusAndCalculate(str))  
    const result = intArr.reduce((acc, no) => acc + no)
    return result
}

function splitByMinusAndCalculate(str) {
    if (Number(str)) return Number(Number(str).toFixed(2))
    const strArr = []
    let s = 0
    let parantheses = 0
    for (let j=0; j < str.length; j++) {
        if (str[j] === "(") parantheses++
        if (str[j] === ")") parantheses--
        if (j === str.length-1) strArr.push(str.substring(s,j+1))
        if (parantheses === 0) {
            // Check if "-" is used after an operator or paranthesis
            if (str[j] === "-" && (Number(str[j-1]) || str[j-1] === "0" || str[j-1] === ")")) { 
                strArr.push(str.substring(s,j))
                s = j+1
            }
        }
    }
    const intArr = strArr.map(str => splitByTimeAndCalculate(str))
    const result = intArr.reduce((acc, no) => acc - no)
    return Number(Number(result).toFixed(2))
}

function splitByTimeAndCalculate(str) {
    const strArr = customSplit(str, "*")
    const intArr = strArr.map(str => splitByDivideAndCalculate(str))
    const result = intArr.reduce((acc, no) => acc * no)
    return result
}

function splitByDivideAndCalculate(str) {
    const strArr = customSplit(str, "/")
    const intArr = strArr.map(str => {
        if (str[0] === "(") {
            // If we hit the paranthesis, we calculate it localy by using recursion.
            return splitByPlusAndCalculate(str.substring(1, str.length-1))
        } else {
            return Number(Number(str).toFixed(2))
        }
    })
    const result = intArr.reduce((acc, no) => acc / no)
    return result
}

function customSplit(str, operator) { 
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
    // Handle if str doesn't include the operator
    if (el !== "") { 
        res.push(el)
    }

    return res;
}
// Validates operators and parantheses
function operatorsValid(str) { 

    if ("+*/)".includes(str[0])) return false
    let stack = []
    let operators = ["+","-","*","/"]
    let parantheses = 0
    for (let i=0; i < str.length; i++) {
        if (str[i] === "(") {
            parantheses++
            if (stack.length === 2) return false
            stack = []
            continue
        }
        if (str[i] === ")") {
            parantheses--
            continue
        }
        if (parantheses === 0) {
            operators.includes(str[i]) ? stack.push(str[i]) : stack = []
            if (stack[1] && stack[1] !== "-") return false
            if (stack.length >= 3) return false
        }
    }
    return parantheses === 0
}

export default Calculate