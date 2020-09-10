import appModule = require("../../src/app");
const app = appModule.Server.bootstrap().app;
import request from "supertest";
import {ItemController} from "../controller/ItemController";
import "../enviro";

jest.setTimeout(20000);

describe("Test db", () => { // tests that items can be added to the db
    test("Test inserts", async () => {
        // start the db
        const MongoClient = require("mongodb").MongoClient;
        const uri = "mongodb://localhost:27017";
        const client = new MongoClient(uri, { useNewUrlParser: true });
        // make an item
        const item = new ItemController();
        item.addName("TV");
        item.addPrice(1000);
        // send the item
        request(app)
            .post("/items/add")
            .send(item)
            .end((err, res) => {
                if (err) { return (err); }
            });
        // check if item is in db
        client.connect((err: Error) => {
            const items = client.db("test").collection("items");
            expect(items !== null);
            client.close();
        });
    });
});
