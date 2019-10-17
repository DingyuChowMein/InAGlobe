import React from "react"
import { create } from "react-test-renderer"
import CardIcon from "./CardIcon.js";

describe("CardIcon component", () => {
    test("Matches the snapshot of CardIcon.", () => {
        const comp = create(<CardIcon />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});