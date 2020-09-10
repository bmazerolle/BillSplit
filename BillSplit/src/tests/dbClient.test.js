"use strict";
exports.__esModule = true;
var appModule = require("../../src/app");
var app = appModule.Server.bootstrap().app;
var mongodb_1 = require("mongodb");
var Bill_1 = require("../baseClasses/Bill");
var Purchase_1 = require("../baseClasses/Purchase");
var BillController_1 = require("../controller/BillController");
var ItemController_1 = require("../controller/ItemController");
var UserController_1 = require("../controller/UserController");
var DbClient = require("../DbClient");
var any = jasmine.any;
jest.setTimeout(20000);
test("Test db", function () {
    // setting up a basic item
    var item = new ItemController_1.ItemController();
    item.addName("Item");
    item.addPrice(100);
    var purchase = new Purchase_1.Purchase(item, 10, 3);
    // setting up a basic user
    var user = new UserController_1.UserController();
    user.addName("User");
    user.addPassword("Pass");
    user.addUserName("UserName");
    user.addEmail("user@email.com");
    // create variables
    var bill = new Bill_1.Bill(user);
    var BC = new BillController_1.BillController(user);
    var obj = new mongodb_1.ObjectId(5);
    var bills = DbClient.getBill(obj);
    var all = DbClient.getAll("Bills");
    // test database functions
    DbClient.connect();
    DbClient.insert("Bills", any);
    DbClient.push("Bills", obj, any);
    // DbClient.updateOne("Bills", obj, any);
    DbClient.upsert("Bills", any);
    DbClient.updateOne("Bills", obj, any);
    DbClient.aggGroups();
    // do tests to expect from DB
    expect(DbClient.getGroup("NULL") === null);
    expect(bills === null);
    expect(DbClient.getAll("Bills") !== null);
    expect(DbClient.getUser("User") !== null);
    expect(DbClient.getUserObject(obj) !== null);
    expect(all !== null);
});
