import React from "react"
import { create } from "react-test-renderer"
import CustomInput from "./CustomInput.js";

describe("CustomInput component", () => {
    test("Matches the snapshot of CustomInput.", () => {
        const comp = create(<CustomInput />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});