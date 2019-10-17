import React from "react"
import { create } from "react-test-renderer"
import CardAvatar from "./CardAvatar.js";

describe("CardAvatar component", () => {
    test("Matches the snapshot of CardAvatar.", () => {
        const comp = create(<CardAvatar />)
        expect(comp.toJSON()).toMatchSnapshot()
    });
});