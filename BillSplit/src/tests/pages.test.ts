import appModule = require("../../src/app");
const app = appModule.Server.bootstrap().app;
import request from "supertest";

// This is a series of get request tests for the pages

describe("GET / - a non-existent api endpoint", () => {
    it("Passes if not found", async () => {
        const res = request(app).get("/non-existent").expect(404);
    });
});

describe("GET / - login api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/login").expect(200);
    });
});

describe("GET / - home api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/").expect(200);
    });
});

describe("GET / - register api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/register").expect(200);
    });
});

describe("GET / - profile api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/profile").expect(200);
    });
});

describe("GET / - index api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/index").expect(200);
    });
});

describe("GET / - purchases add api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/purchases/add").expect(200);
    });
});

describe("GET / - purchases api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/purchases").expect(200);
    });
});

describe("GET / - bills api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/bills").expect(200);
    });
});

describe("GET / - bills create api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/bills/create").expect(200);
    });
});

describe("GET / - users api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/users").expect(200);
    });
});

describe("GET / - add group api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/group/addGroup").expect(200);
    });
});

describe("GET / - add group api endpoint", () => {
    it("Passes if found", async () => {
        const res = request(app).get("/group/remove").expect(200);
    });
});


