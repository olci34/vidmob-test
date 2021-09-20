import { useState } from 'react'
import ErrorsContainer from './ErrorsContainer'

function Calculate() {

    const [input, setInput] = useState("")
    const [result, setResult] = useState("0")
    const [error, setError] = useState("")
    const handleChange = (e) => { setInput(e.target.value) }
    const handleCalculateButton = () => {
        let result = calculate(input, setError) 
        setResult(result)
    }

    return (
        <div id='calculate-box'>
            <input id="input" type="text" value={input} onChange={handleChange}></input>
            <button id="calculate-button" onClick={handleCalculateButton}>Calculate</button>
            <h3 id="result"> Result: {result} </h3>
            <ErrorsContainer errors={error} />
        </div>
    )
}

function calculate(str, setError) {
    // Get rid of spaces.
    str = str.replace(/\s/g, '')
    setError("")
    // Check for validations
    try {
        inputValid(str)
        syntaxValid(str)
    } catch (error) {
        setError(error.message)
        return
    }
    return splitByPlusAndCalculate(str)
}

function splitByPlusAndCalculate(str) {
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
            return calculate(str.substring(1, str.length-1))
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
function syntaxValid(str) { 
    const errorMessage = `Syntax Error.
                            You can't use more than 2 operators in series.
                            The second operator of a series can only be '-'.
                            You can't leave paranthesis open.
                            You can't start with operators expect it is a negative number.`
    const error = new SyntaxError(errorMessage)
    /* 
    Validates for operators and parantheses of str.
    #syntaxValid() ignores inside of parantheses during validation.
    Because it is called in #calculate() and 
    #calculate() is called recursively to handle inside of parantheses.
    */
    if ("+*/)".includes(str[0])) throw error // str can't start with "+/*)"
    if ("+-*/.".includes(str[str.length-1])) throw error // str can't end with an operator
    let stack = []
    let operators = ["+","-","*","/"]
    let parantheses = 0
    for (let i=0; i < str.length; i++) {
        if (str[i] === "(") {
            parantheses++
            if (stack.length === 2) throw error
            stack = []
            continue
        }
        if (str[i] === ")") {
            parantheses--
            continue
        }
        if (parantheses === 0) {
            operators.includes(str[i]) ? stack.push(str[i]) : stack = []
            if (stack[1] && stack[1] !== "-") throw error
            if (stack.length >= 3) throw error
        }
    }
}

function inputValid(input) {
    const error = new Error("Invalid Input. Please only use digits and +-*/() characters.")
    const inputArr = input.match(/[\d*/+-/().\s]/g)
    if (inputArr === null) throw error
    if (inputArr && inputArr.length !== input.length) {
        throw error
    }
}

export default Calculate