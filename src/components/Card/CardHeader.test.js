import React from "react"
import { create } from "react-test-renderer"
import CardHeader from "./CardHeader.js";

describe("CardHeader component", () => {
    test("Matches the snapshot of CardHeader.", () => {
        const comp = create(<CardHeader />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});