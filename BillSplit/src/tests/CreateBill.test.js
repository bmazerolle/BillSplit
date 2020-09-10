"use strict";
exports.__esModule = true;
var Bill_1 = require("../baseClasses/Bill");
var Purchase_1 = require("../baseClasses/Purchase");
var ItemController_1 = require("../controller/ItemController");
var UserController_1 = require("../controller/UserController");
test("null test", function () {
    var item = new ItemController_1.ItemController();
    item.addName("");
    item.addPrice(0);
    var purchase = new Purchase_1.Purchase(item, 0, 0);
    var user = new UserController_1.UserController();
    user.addName("");
    user.addPassword("");
    user.addUserName("");
    user.addEmail("");
    var bill = new Bill_1.Bill(user);
    expect(bill.payee.name === "");
});
test("normal test", function () {
    var item = new ItemController_1.ItemController();
    item.addName("TV");
    item.addPrice(1000);
    var purchase = new Purchase_1.Purchase(item, 5, 5);
    var user = new UserController_1.UserController();
    user.addName("User");
    user.addPassword("Pass");
    user.addUserName("UserName");
    user.addEmail("user@email.com");
    var bill = new Bill_1.Bill(user);
    expect(bill.groupName !== null);
    expect(bill.payee === user);
});
