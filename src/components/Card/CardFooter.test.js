import React from "react"
import { create } from "react-test-renderer"
import CardFooter from "./CardFooter.js";

describe("CardFooter component", () => {
    test("Matches the snapshot of CardFooter.", () => {
        const comp = create(<CardFooter />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});