import React from "react"
import { create } from "react-test-renderer"
import CardBody from "./CardBody.js";

describe("CardBody component", () => {
    test("Matches the snapshot of CardBody.", () => {
        const comp = create(<CardBody />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});