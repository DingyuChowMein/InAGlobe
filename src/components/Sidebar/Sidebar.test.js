import React from "react"
import { create } from "react-test-renderer"
import Sidebar from "./Sidebar.js";

describe("Sidebar component", () => {
    test("Matches the snapshot of Sidebar.", () => {
        const comp = create(<Sidebar />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});