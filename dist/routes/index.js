"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRoutes = exports.transactionRoutes = exports.cardRoutes = exports.companyRoutes = void 0;
var companyRoutes_1 = require("./companyRoutes");
Object.defineProperty(exports, "companyRoutes", { enumerable: true, get: function () { return __importDefault(companyRoutes_1).default; } });
var cardRoutes_1 = require("./cardRoutes");
Object.defineProperty(exports, "cardRoutes", { enumerable: true, get: function () { return __importDefault(cardRoutes_1).default; } });
var transactionRoutes_1 = require("./transactionRoutes");
Object.defineProperty(exports, "transactionRoutes", { enumerable: true, get: function () { return __importDefault(transactionRoutes_1).default; } });
var invoiceRoutes_1 = require("./invoiceRoutes");
Object.defineProperty(exports, "invoiceRoutes", { enumerable: true, get: function () { return __importDefault(invoiceRoutes_1).default; } });
