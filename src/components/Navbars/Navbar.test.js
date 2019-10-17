import React from "react"
import { create } from "react-test-renderer"
import Navbar from "./Navbar.js";

describe("Navbar component", () => {
    test("Matches the snapshot of Navbar.", () => {
        const comp = create(<Navbar />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});