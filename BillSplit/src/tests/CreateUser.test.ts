import { UserController } from "../controller/UserController";

test("null test", () => { // test for null user
    const user = new UserController();
    user.addEmail("");
    user.addUserName("");
    user.addPassword("");
    user.addName("");
    const  test = expect(user.name === "") &&  expect(user.userName === "")  &&
    expect(user.userPassword === "") &&  expect(user.paypalEmail === "");
});

test("full test", () => { // test for dummy user
    const user = new UserController();
    user.addName("User");
    user.addPassword("Pass");
    user.addUserName("UserName");
    user.addEmail("user@email.com");
    const test = expect(user.name === "User") &&  expect(user.userName === "UserName")  &&
    expect(user.userPassword === "Pass") &&  expect(user.paypalEmail === "user@email.com");
});
