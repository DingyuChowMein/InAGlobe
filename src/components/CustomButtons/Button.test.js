import React from "react"
import { create } from "react-test-renderer"
import Button from "./Button.js";

describe("Button component", () => {
    test("Matches the snapshot of Button.", () => {
        const comp = create(<Button />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});