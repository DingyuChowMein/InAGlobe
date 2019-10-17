import cardData from "./ProjectData.js"

describe("Property Checking for Cards", () => {

    const propertyChecker = (tag, property) => {
        test(tag, () =>{
            cardData.map(card => {
                expect(card).toHaveProperty(property)
            })
        })
    }

    propertyChecker("Each project needs a title.", "title")
    propertyChecker("Each project needs the name of the organisation.", "organisation")
    propertyChecker("Each project needs the location where the project will take place.", "location")
    propertyChecker("Each project needs a status letting you know what's going on with it.", "status")
    propertyChecker("Each project needs a short description to be shown in the project list.", "shortDescription")
    propertyChecker("Each project needs a detailed description to be shown in the project page.", "detailedDescription")
    propertyChecker("Each project must have a list of images (could be an empty list).", "images")
    propertyChecker("Each project must have a list of documents (could be empty list).", "documents")

    test("Check title is not an empty string", () => {
        cardData.map(card => {
            expect(card["title"].length).toBeGreaterThan(0)
        })
    })

    test("Check name of organisation is not an empty string", () => {
        cardData.map(card => {
            expect(card["organisation"].length).toBeGreaterThan(0)
        })
    })
})


