import React from "react"
import { create } from "react-test-renderer"
import Home from "./Home.js";

describe("Home layout", () => {
    test("Matches the snapshot of Home.", () => {
        const layout = create(<Home />)
        expect(layout.toJSON()).toMatchSnapshot()
    });
});