import React from "react"
import { create } from "react-test-renderer"
import Footer from "./Footer.js";

describe("Footer component", () => {
    test("Matches the snapshot of Footer.", () => {
        const comp = create(<Footer />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});