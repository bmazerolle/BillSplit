import {Item} from "../baseClasses/Item";

test("null test", () => { // test for null item
    const nullItem = new Item();
    nullItem.addName("");
    nullItem.addPrice(0);
    const test = expect(nullItem.name === "") &&  expect(nullItem.price).toBe(0);

});

test("full test", () => { // test for dummy item
    const nullItem = new Item();
    nullItem.addName("TV");
    nullItem.addPrice(1000);
    const test = expect(nullItem.name === "TV") &&  expect(nullItem.price).toBe(1000);

});
