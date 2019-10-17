import React from "react"
import { create } from "react-test-renderer"
import NavbarLinks from "./NavbarLinks.js";

describe("NavbarLinks component", () => {
    test("Matches the snapshot of NavbarLinks.", () => {
        const comp = create(<NavbarLinks />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});