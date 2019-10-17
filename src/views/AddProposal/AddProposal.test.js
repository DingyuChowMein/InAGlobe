import React from "react"
import { create } from "react-test-renderer"
import AddProposal from "./AddProposal.js";

describe("AddProposal View", () => {
    test("Matches the snapshot of AddProposal.", () => {
        const view = create(<AddProposal />)
        expect(view.toJSON()).toMatchSnapshot()
    });
});