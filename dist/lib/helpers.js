"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskCardNumber = exports.isValidLastFourDigits = void 0;
const isValidLastFourDigits = (value) => {
    // Regex: must be exactly 4 digits (0–9)
    return /^[0-9]{4}$/.test(value);
};
exports.isValidLastFourDigits = isValidLastFourDigits;
const maskCardNumber = (cardNumber) => {
    return cardNumber.slice(-4).padStart(16, '*');
};
exports.maskCardNumber = maskCardNumber;
