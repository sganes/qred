import { expect } from 'chai';
import { isValidLastFourDigits, maskCardNumber } from './helpers';

describe('helpers', () => {
    describe('isValidLastFourDigits', () => {
        it('should validate the last four digits in the card to be digits', () => {
            expect(isValidLastFourDigits('12a4')).to.be.false;
            expect(isValidLastFourDigits('1234')).to.be.true;
            expect(isValidLastFourDigits('123')).to.be.false;
            expect(isValidLastFourDigits('12345')).to.be.false;
            expect(isValidLastFourDigits('abcd')).to.be.false;
        });
    });

    describe('masked card number', () => {
        it('should return correct masked card number', () => {
            expect(maskCardNumber('1234')).to.equal("************1234");
            expect(maskCardNumber('5678901234567890')).to.equal("************7890");
            expect(maskCardNumber('0000')).to.equal("************0000");
        });
    });


});