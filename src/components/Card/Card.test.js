import React from "react"
import { create } from "react-test-renderer"
import Card from "./Card.js";

describe("Card component", () => {
    test("Matches the snapshot of Card.", () => {
        const comp = create(<Card />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});