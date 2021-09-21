import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import Calculate from "./Calculate";
import ErrorsContainer from "./ErrorsContainer";

let errors;
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
    errors = screen.getByLabelText("current-errors")
})

describe("<ErrorsContainer />", () => {
    
    test("renders ErrorContainer", () => {
        expect(errors.textContent).toBe("")
    })

    test("renders error when if one is thrown", () => {
        askTheQuestionOf("15+  invalid input")
        expect(errors.textContent).toBe("Please only use digits and +-*/() characters without any space.")
        askTheQuestionOf("15-+ -3")
        expect(errors.textContent).toMatch(/[You can't use more than 2 operators]+/)
    })

    test("sets populated error text back to empty string", () => {
        askTheQuestionOf("15---invalid")
        expect(errors.textContent).toBe("Please only use digits and +-*/() characters without any space.")
        askTheQuestionOf("2+3")
        expect(errors.textContent).toBe("")
    })
})
