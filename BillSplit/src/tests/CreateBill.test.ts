import {ObjectId} from "mongodb";
import {Bill} from "../baseClasses/Bill";
import {Purchase} from "../baseClasses/Purchase";
import {UserController} from "../controller/UserController";

test("null test", () => { // create a bill and assign it to nobody
        const item = new ObjectId("5ddaff0802aed89a3455e616");
        const date = new Date();
        const purchase = new Purchase(date, item, 5, "Purchase Name", 5.99, 5 , "group");
        const user = new UserController();
        user.addName("");
        user.addPassword("");
        user.addUserName("");
        user.addEmail("");
        const bill = new Bill(user);
        expect(bill.payee.name === "");
});


test("normal test", () => { // create a bill and assign it to a real user
        const item = new ObjectId("5ddaff0802aed89a3455e616");
        const date = new Date();
        const purchase = new Purchase(date, item, 5, "Purchase Name", 5.99, 5 , "group");
        const user = new UserController();
        user.addName("User");
        user.addPassword("Pass");
        user.addUserName("UserName");
        user.addEmail("user@email.com");
        const bill = new Bill(user);
        expect(bill.groupName !== null);
        expect(bill.payee === user);
});


