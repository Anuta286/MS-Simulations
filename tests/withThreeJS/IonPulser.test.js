import {IonPulser} from '../../src/MS/IonPulser.js';
import assert from 'assert';
import {Vector2D} from "../../src/MathUtils/Vector2D.js";

describe('IonPulser', () => {

    it('returns field zero if the particle is too far', () => {
        const position = new Vector2D(-2, -2);

        let actualField = new IonPulser(1, 10, new Vector2D(-1, -1), true, 0).getField(position);
        assert.equal(actualField.x, 0);
        assert.equal(actualField.y, 0);
    });

    it('calculates field vector when IonPulser is at an angle', () => {
        const position = new Vector2D(-1.3, -1.4);

        let actualField = new IonPulser(1, 10, new Vector2D(-1, -1), true, Math.PI/3).getField(position)
            .multipleByScalar(1/(14.16*10e9));
        assert.equal(actualField.x.toFixed(3), 0.823);
        assert.equal(actualField.y.toFixed(3), -1.927);
    });

    it('calculates field vector', () => {
        const position = new Vector2D(-1.3, -1.4);

        let actualField = new IonPulser(1, 10, new Vector2D(-1, -1), true, 0).getField(position)
            .multipleByScalar(1/(14.16*10e9));
        assert.equal(actualField.x.toFixed(3), -1.257);
        assert.equal(actualField.y.toFixed(3), -1.676);
    });

    it('calculates definite integral for the first coordinate of field vector', () => {
        const a = 2;
        const b = 3;
        const result = 1.162;

        assert.equal(new IonPulser().calculateTheFirstCoordinateDefiniteIntegral(a, b).toFixed(3), result);
    });

    it('calculates definite integral for the second coordinate of field vector', () => {
        const a = 2;
        const b = 3;
        const result = 1.743;

        assert.equal(new IonPulser().calculateTheSecondCoordinateDefiniteIntegral(a, b).toFixed(3), result);
    });

    it('returns denominator for calculating integrals', () => {
        const a = 2;
        const b = 3;
        const result = 15.297;

        assert.equal(new IonPulser().calculateDenominator(a, b).toFixed(3), result);
    });

});
