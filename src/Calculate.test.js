import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import Calculate from "./Calculate";

let wrapper;
let input;
let calculateButton;
let clickCalculateButton;
let result;

const askTheQuestionOf = (question) => {
    fireEvent.change(input, {target: {value: question}})
    fireEvent(calculateButton, clickCalculateButton)
}

beforeEach(() => {
    wrapper = render(<Calculate />)
    input = wrapper.getByLabelText("input")
    calculateButton = screen.getByText("Calculate")
    clickCalculateButton = createEvent.click(calculateButton)
    result = screen.getByLabelText("result")
})

describe("<Calculate />", () => {

    test("renders Calculate", () => {
        screen.getByText("Calculate")
        expect(result.textContent).toBe("0")
    })

    test("calculates addition", () => {
        askTheQuestionOf("1+2")
        expect(result.textContent).toBe("3")
    })

    test("calculates subtraction", () => {
        askTheQuestionOf("-5+-8--11")
        expect(result.textContent).toBe("-2")
    })

    test("calculates multiplication", () => {
        askTheQuestionOf("-5+-8--11*2")
        expect(result.textContent).toBe("9")
    })

    test("calculates division", () => {
        askTheQuestionOf("4*5/2")
        expect(result.textContent).toBe("10")
    })

    test("calculates decimals", () => {
        askTheQuestionOf("-.32   /.5")
        expect(result.textContent).toBe("-0.64")
    })

    test("calculates with parantheses", () => {
        askTheQuestionOf("(4-2)*3.5")
        expect(result.textContent).toBe("7")
    })

    test("calculates with nested parantheses", () => {
        askTheQuestionOf("-52+-3*(-6+4/2-(10/5)-(8+7))")
        expect(result.textContent).toBe("11")
    })

    test("throws error if more than 2 operators are used in a series", () => {
        askTheQuestionOf("2-+-4")
        expect(result.textContent).toBe("SyntaxError")
    })

    test("throws error if second operator of a series of two is not '-' ", () => {
        askTheQuestionOf("15-+6")
        expect(result.textContent).toBe("SyntaxError")
        askTheQuestionOf("13+-8")
        expect(result.textContent).toBe("5")
    })

    test("throws error if the input or inside of parantheses ends with an operator", () => {
        askTheQuestionOf("2+6-")
        expect(result.textContent).toBe("SyntaxError")
        askTheQuestionOf("3*(-6*3/)")
        expect(result.textContent).toBe("SyntaxError")
    })

    test("throws error if the input or inside of parantheses starts with any of '*/)' or '+' or '--' ", () => {
        askTheQuestionOf("--2*8")
        expect(result.textContent).toBe("SyntaxError")
        askTheQuestionOf("5*(+6-5)")
        expect(result.textContent).toBe("SyntaxError")
        askTheQuestionOf("+6")
        expect(result.textContent).toBe("SyntaxError")
    })

    test("throws error if decimal point is used in series or in wrong places", () => {
        askTheQuestionOf("15.3.+5")
        expect(result.textContent).toBe("SyntaxError")
        askTheQuestionOf("15.. *5")
        expect(result.textContent).toBe("SyntaxError")
        askTheQuestionOf("5*.(3+6)")
        expect(result.textContent).toBe("SyntaxError")
    })    

    test("throws error if input is invalid", () => {
        askTheQuestionOf("19 + cinnamon")
        expect(result.textContent).toBe("Error")
        askTheQuestionOf("19 + %5")
        expect(result.textContent).toBe("Error")
    })

})