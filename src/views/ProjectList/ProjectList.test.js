import React from "react"
import { create } from "react-test-renderer"
import ProjectList from "./ProjectList.js";

describe("ProjectList View", () => {
    test("Matches the snapshot of ProjectList.", () => {
        const view = create(<ProjectList />)
        expect(view.toJSON()).toMatchSnapshot()
    });
});