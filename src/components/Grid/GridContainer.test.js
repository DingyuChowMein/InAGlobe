import React from "react"
import { create } from "react-test-renderer"
import GridContainer from "./GridContainer.js";

describe("GridContainer component", () => {
    test("Matches the snapshot of GridContainer.", () => {
        const comp = create(<GridContainer />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});