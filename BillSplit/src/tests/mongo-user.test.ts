import appModule = require("../../src/app");
const app = appModule.Server.bootstrap().app;
import request from "supertest";
import {UserController} from "../controller/UserController";
import "../enviro";

jest.setTimeout(10000);

describe("Test db", () => { // Tests that users can be added to db
    test("Tests that users can be added to db", async () => {
        // start db
        const MongoClient = require("mongodb").MongoClient;
        const uri = "mongodb://localhost:27017";
        const client = new MongoClient(uri, { useNewUrlParser: true });
        const user = new UserController();
        // make a user
        user.addEmail("user@email.com");
        user.addUserName("UserName");
        user.addPassword("Pass");
        user.addName("User");
        // post the user
        request(app)
            .post("/create")
            .send(user)
            .end((err, res) => {
                if (err) { return (err); }
            });
        // expect the user in the db
        client.connect((err: Error) => {
            const users = client.db("test").collection("users");
            expect(users !== null);
            client.close();
        });
    });
});
