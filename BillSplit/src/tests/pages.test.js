"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var appModule = require("../../src/app");
var app = appModule.Server.bootstrap().app;
var supertest_1 = __importDefault(require("supertest"));
// This is a series of get request tests for the pages
describe("GET / - a non-existent api endpoint", function () {
    it("Passes if not found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/non-existent").expect(404);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - login api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/login").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - home api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - register api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/register").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - profile api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/profile").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - index api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/index").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - purchases add api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/purchases/add").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - purchases api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/purchases").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - bills api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/bills").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - bills create api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/bills/create").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - users api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/users").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - add group api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/group/addGroup").expect(200);
            return [2 /*return*/];
        });
    }); });
});
describe("GET / - add group api endpoint", function () {
    it("Passes if found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = supertest_1["default"](app).get("/group/remove").expect(200);
            return [2 /*return*/];
        });
    }); });
});
