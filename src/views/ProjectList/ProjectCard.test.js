import React from "react"
import { create } from "react-test-renderer"
import ProjectCard from "./ProjectCard.js";

describe("ProjectCard View", () => {
    test("Matches the snapshot of ProjectCard.", () => {
        const view = create(<ProjectCard />)
        expect(view.toJSON()).toMatchSnapshot()
    });
});