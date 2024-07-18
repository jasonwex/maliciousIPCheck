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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = void 0;
var bcrypt = require("bcrypt");
// Function to hash passwords asynchronously
var hashPassword = function (plaintextPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltRounds = 10;
                return [4 /*yield*/, bcrypt.hash(plaintextPassword, saltRounds)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// seeding some Mock test users instead of storing users somewhere more permanant 
// testing only, should probably use a db
var initializeUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = {};
                _b = {};
                return [4 /*yield*/, hashPassword("pass1")];
            case 1:
                _a.user1 = (_b.password = _l.sent(), _b);
                _c = {};
                return [4 /*yield*/, hashPassword("pass2")];
            case 2:
                _a.user2 = (_c.password = _l.sent(), _c);
                _d = {};
                return [4 /*yield*/, hashPassword("pass3")];
            case 3:
                _a.user3 = (_d.password = _l.sent(), _d);
                _e = {};
                return [4 /*yield*/, hashPassword("pass4")];
            case 4:
                _a.user4 = (_e.password = _l.sent(), _e);
                _f = {};
                return [4 /*yield*/, hashPassword("pass5")];
            case 5:
                _a.user5 = (_f.password = _l.sent(), _f);
                _g = {};
                return [4 /*yield*/, hashPassword("pass6")];
            case 6:
                _a.user6 = (_g.password = _l.sent(), _g);
                _h = {};
                return [4 /*yield*/, hashPassword("pass7")];
            case 7:
                _a.user7 = (_h.password = _l.sent(), _h);
                _j = {};
                return [4 /*yield*/, hashPassword("pass8")];
            case 8:
                _a.user8 = (_j.password = _l.sent(), _j);
                _k = {};
                return [4 /*yield*/, hashPassword("pass9")];
            case 9: return [2 /*return*/, (_a.user9 = (_k.password = _l.sent(), _k),
                    _a)];
        }
    });
}); };
// Variable to hold users
var users;
// Initialize users and handle errors
initializeUsers().then(function (initializedUsers) {
    users = initializedUsers;
}).catch(function (err) {
    console.error("Error initializing users:", err);
});
/**
 * Mock implementation of findUser.
 * @param {string} username - The username to find.
 * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
 */
var findUser = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                var user = users[username];
                resolve(user || null);
            })];
    });
}); };
exports.findUser = findUser;
