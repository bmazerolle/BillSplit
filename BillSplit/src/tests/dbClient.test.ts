import appModule = require("../../src/app");
const app = appModule.Server.bootstrap().app;
import {ObjectId} from "mongodb";
import {Bill} from "../baseClasses/Bill";
import {Item} from "../baseClasses/Item";
import {Purchase} from "../baseClasses/Purchase";
import {BillController} from "../controller/BillController";
import {ItemController} from "../controller/ItemController";
import {UserController} from "../controller/UserController";
import DbClient = require("../DbClient");
import any = jasmine.any;

jest.setTimeout(20000);

test("Test db", () => {
        // setting up a basic item
        const item = new ObjectId("5ddaff0802aed89a3455e616");
        const date = new Date();
        const purchase = new Purchase(date, item, 5, "Purchase Name", 5.99, 5 , "group");
        // setting up a basic user
        const user = new UserController();
        user.addName("User");
        user.addPassword("Pass");
        user.addUserName("UserName");
        user.addEmail("user@email.com");
        // create variables
        const bill = new Bill(user);
        const BC = new BillController(user);
        const obj = new ObjectId(5);
        const bills = DbClient.getBill(obj);
        const all = DbClient.getAll("Bills");
        // test database functions
        DbClient.connect();
        DbClient.insert("Bills", any);
        DbClient.push("Bills", obj, any);
        // DbClient.updateOne("Bills", obj, any);
        DbClient.upsert("Bills", any);
        DbClient.updateOne("Bills", obj, any);
        DbClient.aggGroups();
        // do tests to expect from DB
        expect(DbClient.getGroup(new ObjectId()) === null);
        expect(bills === null);
        expect(DbClient.getAll("Bills") !== null);
        expect(DbClient.getUser("User") !== null);
        expect(DbClient.getUserObject(obj) !== null);
        expect(all !== null);
    });

