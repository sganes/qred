export const isValidLastFourDigits = (value: string): boolean => {
    // Regex: must be exactly 4 digits (0–9)
    return /^[0-9]{4}$/.test(value);
};

export const maskCardNumber = (cardNumber: string): string => {
    return cardNumber.slice(-4).padStart(16, '*');
};