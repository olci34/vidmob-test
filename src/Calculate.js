import { useState } from 'react'
import ErrorsContainer from './ErrorsContainer'

function Calculate() {

    const [input, setInput] = useState("")
    const [result, setResult] = useState("0")
    const [error, setError] = useState("")
    const handleChange = (e) => { setInput(e.target.value) }
    const handleCalculateButton = () => {
        // Get rid of spaces.
         const str = input.replace(/\s/g, '')
        try {
            setError("")
            const result = calculate(str)
            setResult(result)
        } catch (error) {
            setResult(error.name)
            setError(error.message)
        }
    }

    return (
        <div id='calculate-box'>
            <input id="input" aria-label="input" type="text" value={input} onChange={handleChange}></input>
            <button id="calculate-button" onClick={handleCalculateButton}>Calculate</button>
            <h3 id="result"> Result: <label aria-label={"result"}>{result}</label> </h3>
            <ErrorsContainer errors={error} />
        </div>
    )
}

function calculate(str) {
    // Check for validations.
    if (!inputValid(str)) throw new Error('Please only use digits and +-*/() characters without any space.')
    if (!syntaxValid(str)) throw new SyntaxError(`You can't use more than 2 operators in series.
                                                    The second operator of a series can only be '-'.
                                                    You can't leave paranthesis open.
                                                    You can't start with operators unless it is a negative number.`)
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
    /* 
    Validates for operators and parantheses of str.
    #syntaxValid() ignores inside of parantheses during validation.
    Because it is called in #calculate() and 
    #calculate() is called recursively to handle inside of parantheses.
    */
    if ("+*/)".includes(str[0]) || str.startsWith("--")) return false // str can't start with "+/*)" or "--"
    if ("+-*/.".includes(str[str.length-1])) return false // str can't end with an operator
    if (str.match(/([.])+[+-/*(]/)) return false // validates usage of "."
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
            if (stack[1] && stack[1] !== "-") return false // Second operator in a series can only be "-"
            if (stack.length > 2) return false // Operator series can't be longer than 2
        }
    }
    return parantheses === 0
}

function inputValid(input) {
    const inputArr = input.match(/[\d*/+-/().]/g)
    return (inputArr && inputArr.length === input.length)
}

export default Calculate