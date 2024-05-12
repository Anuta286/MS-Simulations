import {IonPulser} from '../../src/MS/IonPulser.js';
import assert from 'assert';
import {Vector2D} from "../../src/MathUtils/Vector2D.js";

describe('IonPulser', () => {

    it('returns field zero if the particle is too far', () => {
        const position = new Vector2D(-2, -2);

        let actualField = new IonPulser(1, 10, new Vector2D(-1, -1), true).getField(position);
        assert.equal(actualField.x, 0);
        assert.equal(actualField.y, 0);
    });

    it('calculates field vector', () => {
        const position = new Vector2D(-1.36, -1.36);

        let actualField = new IonPulser(1, 10, new Vector2D(-1, -1), true).getField(position)
            .multipleByScalar(1/(7.08*10e9));
        assert.equal(actualField.x.toFixed(3), -1.481);
        assert.equal(actualField.y.toFixed(3), -1.481);
    });

    it('calculates definite integral for the first coordinate of field vector', () => {
        const a = 2;
        const b = 3;
        const r = 4;
        const result = 1.162;

        assert.equal(new IonPulser().calculateTheFirstCoordinateDefiniteIntegral(a, b, r).toFixed(3), result);
    });

    it('calculates definite integral for the second coordinate of field vector', () => {
        const a = 2;
        const b = 3;
        const r = 4;
        const result = 1.743;

        assert.equal(new IonPulser().calculateTheSecondCoordinateDefiniteIntegral(a, b, r).toFixed(3), result);
    });

    it('returns denominator for calculating integrals', () => {
        const a = 2;
        const b = 3;
        const r = 4;
        const x = Math.PI;
        const result = 15.297;

        assert.equal(new IonPulser().calculateDenominator(a, b, r, x).toFixed(3), result);
    });

});
