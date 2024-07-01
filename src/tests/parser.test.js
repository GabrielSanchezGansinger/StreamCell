import { describe, it, expect } from 'vitest';
import { getEval } from '../Parser/parser';

describe('ArithTests', () => {
    let A = '$col_A';
    let B = '$col_B';
    let C = '$col_C';
    let D = '$col_D';
    let E = '$col_E';
    let R1 = '$row_1';
    let R2 = '$row_2';
    let R3 = '$row_3';
    let R4 = '$row_4';
    let cols = [A, B, C, D, E];
    let rows = [R1, R2, R3, R4];
    let data = Array(rows.length)
        .fill(0)
        .map(() => Array(cols.length).fill({ value: '', function: '' }));

    let dataMap = new Map();

    let R1NestedMap = new Map();
    R1NestedMap.set(A, { value: '3.36', function: '' });
    R1NestedMap.set(B, { value: '-55.60', function: '' });
    R1NestedMap.set(C, { value: '70', function: '' });
    R1NestedMap.set(E, { value: 'true', function: '' });

    let R2NestedMap = new Map();
    R2NestedMap.set(A, { value: '2', function: '' });
    R2NestedMap.set(B, { value: '30', function: '' });
    R2NestedMap.set(C, { value: '4', function: '' });
    R2NestedMap.set(E, { value: 'false', function: '' });

    let R3NestedMap = new Map();
    R3NestedMap.set(A, { value: '-5', function: '' });
    R3NestedMap.set(B, { value: '50', function: '' });
    R3NestedMap.set(C, { value: '1', function: '' });

    let R4NestedMap = new Map();
    R4NestedMap.set(A, { value: '' + Number.MAX_SAFE_INTEGER, function: '' });
    R4NestedMap.set(B, { value: '' + Number.MIN_SAFE_INTEGER, function: '' });
    R4NestedMap.set(C, { value: 'Hello', function: '' });

    dataMap.set(R1, R1NestedMap);
    dataMap.set(R2, R2NestedMap);
    dataMap.set(R3, R3NestedMap);
    dataMap.set(R4, R4NestedMap);

    data[0][0] = { value: '3.36', function: '' };
    data[0][1] = { value: '-55.60', function: '' };
    data[0][2] = { value: '70', function: '' };
    data[0][4] = { value: 'true', function: '' };
    data[1][0] = { value: '2', function: '' };
    data[1][1] = { value: '30', function: '' };
    data[1][2] = { value: '4', function: '' };
    data[1][4] = { value: 'false', function: '' };
    data[2][0] = { value: '-5', function: '' };
    data[2][1] = { value: '50', function: '' };
    data[2][2] = { value: '1', function: '' };
    data[3][0] = { value: '' + Number.MAX_SAFE_INTEGER, function: '' };
    data[3][1] = { value: '' + Number.MIN_SAFE_INTEGER, function: '' };
    data[3][2] = { value: 'Hello', function: '' };

    const Range1 = A + R1 + ':' + A + R3;
    const Range2 = A + R1 + ':' + C + R2;
    const Range3 = B + R1 + ':' + C + R3;
    const Range_Extreme = A + R1 + ':' + B + R4;
    const Range_String = B + R1 + ':' + C + R4;
    const Range2_WEmpty = A + R1 + ':' + D + R2;
    const Range3_WEmpty = B + R1 + ':' + D + R3;

    const variousNumbers1 = A + R1 + ';' + B + R2 + ';' + C + R3;
    const variousNumbers2 = C + R1 + ';' + B + R2 + ';' + B + R3;
    const twoNumbers1 = A + R1 + ';' + B + R1;
    const twoNumbers2 = A + R3 + ';' + C + R1;

    const variousNumbers1_WEmpty =
        A + R1 + ';' + B + R2 + ';' + C + R3 + ';' + D + R1;
    const variousNumbers2_WEmpty =
        C + R1 + ';' + B + R2 + ';' + B + R3 + ';' + D + R4;
    const variousNumbers3_WEmpty =
        A + R1 + ';' + B + R2 + ';' + C + R3 + ';' + D + R3;

    const ifFunc = (cond, thenCase, elseCase) => {
        return '=IF(' + cond + ';' + thenCase + ';' + elseCase + ')';
    };

    const logFunc = (base, argument) => {
        return '=LOG(' + base + ';' + argument + ')';
    };

    const powerFunc = (base, exponent) => {
        return '=POWER(' + base + ';' + exponent + ')';
    };

    /**
     *      A       B       C       D       E
     *
     * 1    3.36    -55.60  70      ""      true
     * 2    2       30      4       ""      false
     * 3    -5      50      1       ""      ""
     * 4    MAX     MIN     "Hello" ""      ""
     */
    const getInfo = () => {
        return { rows: rows, cols: cols, data: dataMap };
    };
    const evaluate = getEval(getInfo);

    it('Sum of string not possible', () => {
        //define function =SUM(A1;B1)
        let func = '=SUM(' + Range_String + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Sum of various numbers works', () => {
        let func = '=SUM(' + variousNumbers1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(34.36);
    });

    it('Sum of other function works', () => {
        let func =
            '=SUM(' +
            A +
            R1 +
            ';MINUS(' +
            B +
            R3 +
            ';' +
            B +
            R2 +
            ');' +
            C +
            R3 +
            ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(24.36);
    });

    it('Sum of range works', () => {
        //=SUM(A1:C2)
        let func = '=SUM(' + Range2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(53.76);
    });

    it('Sum works with empty cells', () => {
        let func = '=SUM(' + Range2_WEmpty + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(53.76);
    });

    it('Minus only accepts to operators', () => {
        let func = '=MINUS(' + variousNumbers1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#SYN');
    });

    it('Minus works with negative numbers', () => {
        let func = '=MINUS(' + B + R1 + ';' + A + R3 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-50.6);
    });

    it('Minus can return negative values', () => {
        let func = '=MINUS(' + B + R2 + ';' + B + R3 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-20);
    });

    it('Minus has neutral element 0', () => {
        let func = '=MINUS(' + C + R3 + ';0)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(1);
    });

    it('Minus only works with numbers', () => {
        let func = '=MINUS(' + B + R1 + ';' + C + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Minus can have subordinate functions', () => {
        let func = '=MINUS(' + C + R1 + ';SUM(' + Range3 + '))';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(-29.4); //TODO Fix floating point rounding
    });

    it('Sum can handle safe integer range', () => {
        let func = '=SUM(' + A + R4 + ';' + B + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(0);
    });

    it('Min works correctly', () => {
        let func = '=MIN(' + Range3 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-55.6);
    });

    it('Min works with empty cells', () => {
        let func = '=MIN(' + Range3_WEmpty + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-55.6);
    });

    it('Min works with integer limits', () => {
        let func = '=MIN(' + Range_Extreme + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(Number.MIN_SAFE_INTEGER);
    });

    it('Min works with subordinate functions', () => {
        let func =
            '=MIN(' + Range3 + ';' + 'SUM(' + A + R3 + ';' + B + R1 + ')' + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-60.6);
    });

    it('Min works with number literals', () => {
        let func = '=MIN(' + Range3 + ';#PI;-90)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-90);
    });

    it('Min does not work with strings', () => {
        let func = '=MIN(' + Range_String + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Max works correctly', () => {
        let func = '=MAX(' + Range1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3.36);
    });

    it('Max works with integer limits', () => {
        let func = '=MAX(' + Range_Extreme + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('Max works with various numbers and references', () => {
        let func = '=MAX(' + Range3 + ';' + A + R1 + ';60)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(70);
    });

    it('Max works with constants', () => {
        let func = '=MAX(#PI; #EULER)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(Math.PI);
    });

    it('Max does not work with strings', () => {
        let func = '=MAX(' + Range_String + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Mult has neutral element 1', () => {
        let func = '=MULT(' + Range1 + ';1)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-33.6);
    });

    it('Mult works with constant', () => {
        let func = '=MULT(#PI;#EULER)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(8.539734222673566);
    });

    it('Mult works with various numbers', () => {
        let func = '=MULT(' + variousNumbers2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(105000);
    });

    it('Mult works with various empty cells', () => {
        let func = '=MULT(' + variousNumbers2_WEmpty + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(105000);
    });

    it('Mult with 0 is 0', () => {
        let func = '=MULT(' + variousNumbers2 + '; 0)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(0);
    });

    it('Div works with negative numbers', () => {
        let func = '=DIV(' + twoNumbers1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3.36 / -55.6);
    });

    it('Div by Zero gives error', () => {
        let func = '=DIV(' + A + R1 + ';' + 0 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#DIV/0');
    });

    it('Div works with safe range', () => {
        let func = '=DIV(' + A + R4 + ';' + B + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-1);
    });

    it('Div works with two negative numbers', () => {
        let func = '=DIV(' + A + R3 + ';' + B + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-5 / -55.6);
    });

    it('Div works with small numbers', () => {
        let func = '=DIV( 0.000005;  0.0000000006  )';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(0.000005 / 0.0000000006);
    });

    it('Div does not work with ranges', () => {
        let func = '=DIV(' + Range1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#SYN');
    });

    it('Div works correctly with floating point numbers', () => {
        let func = '=DIV(SUM(' + Range3 + ');' + C + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(1.42); //TODO Fix Floating point arith
    });

    it('Mod works with safe range', () => {
        let func = '=MOD(' + A + R4 + ';' + B + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(0);
    });

    it('Mod works with negative numbers', () => {
        let func = '=MOD(' + A + R3 + ';' + C + R2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-1);
    });

    it('Mod works with subordinate functions', () => {
        let func = '=MOD(SUM(#PI;1);#PI)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(1);
    });

    it('Mod works correctly with floating point numbers', () => {
        let func = '=MOD(SUM(' + Range3 + ');' + C + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(29.400000000000006); //TODO Fix Floating point arith
    });

    it('Mod works if difference is bigger', () => {
        let func = '=MOD(5;6)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(5);
    });

    it('If works correctly', () => {
        let func = '=IF(LE(4 ;5);' + A + R1 + ';' + B + R3 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3.36);
    });

    it('If works with references in conditional', () => {
        let func = ifFunc('GE(' + A + R1 + ';1)', C + R4, B + R1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe('Hello');
    });

    it('If works with strings in conditional', () => {
        let func = ifFunc('EQUAL("Hi";"He")', A + R4, 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe(1);
    });

    it('If works with strings in conditional2', () => {
        let func = ifFunc('LE("Hd";"He")', A + R1, 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3.36);
    });

    it('If works with strings in conditional3', () => {
        let func = ifFunc('GE("Hd";"He")', A + R4, 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe(1);
    });

    it('If works with strings in conditional4', () => {
        let func = ifFunc('EQUAL("He";"He")', A + R1, 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3.36);
    });

    it('If works with functions in conditional', () => {
        let func = ifFunc('LE(SUM(3;4); MINUS(5;1))', A + R4, 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe(1);
    });

    it('If works with reference in conditional', () => {
        let func = ifFunc(E + R1, A + R1, 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3.36);
    });

    it('If works with boolean conditional', () => {
        let func = ifFunc('true', A + R1, 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3.36);
    });

    it('Count works with ranges', () => {
        let func = '=COUNT(' + Range2_WEmpty + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(6);
    });

    it('Count works with several references', () => {
        let func = '=COUNT(' + variousNumbers3_WEmpty + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(3);
    });

    it('Avg with empty range', () => {
        let func = '=AVG(' + D + R1 + ':' + D + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(0);
    });

    it('Avg with normal range', () => {
        let func = '=AVG(' + Range2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(8.96);
    });

    it('Avg with mixed range', () => {
        let func = '=AVG(' + C + R1 + ':' + C + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(25);
    });

    it('Avg with single non number value', () => {
        let func = '=AVG(' + C + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(0);
    });

    it('Avg precission with floating point', () => {
        let func =
            '=AVG(' + C + R1 + ':' + C + R4 + ';99.4;5.412313123123' + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(35.9624626);
    });

    it('Avg works with other funcs', () => {
        let func = '=AVG(' + C + R1 + ':' + C + R4 + ';SUM(5;7)' + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(21.75);
    });

    it('Avg works with other funcs', () => {
        let func = '=AVG(' + C + R1 + ':' + C + R4 + ';SUM(5;7)' + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(21.75);
    });

    it('LE reflexiv', () => {
        let func = '=LE(5;5)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('LE works with cell references', () => {
        let func = '=LE(' + A + R1 + ';5)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('LE works with save integer limits', () => {
        let func = '=LE(' + B + R4 + ';' + A + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('LE works with strings', () => {
        let func = '=LE("hb";"ha")';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(false);
    });

    it('LE does not work with different datatypes', () => {
        let func = '=LE("hi";5)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('GE reflexive', () => {
        let func = '=GE(5.678;5.678)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('GE works with negative numbers', () => {
        let func = '=GE(-1231923123039;5)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(false);
    });

    it('GE works with other functions', () => {
        let func = '=GE(SUM(8;9);MINUS(9;8))';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('GE lexicographical order check works with special characters', () => {
        let func = '=GE("murciélago";"muercielago")';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('GE works with integer save values', () => {
        let func = '=GE(' + A + R4 + ';' + B + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('EQUAL works with integer save values', () => {
        let func = '=EQUAL(' + B + R4 + ';' + B + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('EQUAL works with strings', () => {
        let func = '=EQUAL("Hello";"Hello")';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('EQUAL works with cell references', () => {
        let func = '=EQUAL(' + A + R1 + ';' + B + R2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(false);
    });

    it('EQUAL works with integers and floating point numbers', () => {
        let func = '=EQUAL(4;4.000)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(true);
    });

    it('EQUAL throws error if comparing two completely different types', () => {
        let func = '=EQUAL("Hello";5)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('SINUS works correctly', () => {
        let func = '=SIN(0)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(0);
    });

    it('SINUS works with other functions', () => {
        let func = '=SIN(DIV(#PI;2))';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(1);
    });

    it('SINUS works with negative radians', () => {
        let func = '=SIN(DIV(-#PI;2))';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(-1);
    });

    it('SINUS throws errors with strings', () => {
        let func = '=SIN("HELLO")';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#SYN');
    });

    it('SINUS symmetric', () => {
        let func = '=SIN(DIV(#PI;3))';
        let func_eval = evaluate(func);

        let func2 = '=SIN(DIV(MULT(2;#PI);3))';
        let func_eval2 = evaluate(func2);
        expect(func_eval).toBeCloseTo(func_eval2);
    });

    it('COSINUS symmetric', () => {
        let func = '=COS(DIV(#PI;2))';
        let func_eval = evaluate(func);

        let func2 = '=COS(DIV(MULT(3;#PI);2))';
        let func_eval2 = evaluate(func2);
        expect(func_eval).toBeCloseTo(func_eval2);
    });

    it('COSINUS works with 0', () => {
        let func = '=COS(0)';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(1);
    });

    it('COSINUS works with cell references', () => {
        let func = '=COS(' + C + R3 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0.5403);
    });

    it('COSINUS works with integer save ranges', () => {
        let func = '=COS(' + A + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(-1);
    });

    it('TANGENT works with 0', () => {
        let func = '=TAN(0)';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0);
    });

    it('TANGENT goes to infinity with pi/2', () => {
        let func = '=TAN(DIV(#PI;2))';
        let func_eval = evaluate(func);
        expect(func_eval).toBeGreaterThan(Number.MAX_SAFE_INTEGER);
    });

    it('TANGENT works with Cell References', () => {
        let func = '=TAN(' + A + R2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(-2.18503);
    });

    it('Log works with positive numbers', () => {
        let func = logFunc(A + R2, C + R2);
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(2);
    });

    it('Log throws error with negative numbers as arguments', () => {
        let func = logFunc(A + R2, '-4');
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Log of argument 0 is undefined', () => {
        let func = logFunc(A + R2, 0);
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Log of base 1 undefined', () => {
        let func = logFunc(1, C + R2);
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#DIV/0');
    });

    it('Log with base 0 undefined', () => {
        let func = logFunc(0, C + R2);
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#DIV/0');
    });

    it('Log with base less than 0 undefined', () => {
        let func = logFunc(-1, C + R2);
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#DIV/0');
    });

    it('Log works with e', () => {
        let func = logFunc('#EULER', 1);
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0);
    });

    it('Power works with positive numbers', () => {
        let func = powerFunc(A + R2, C + R2);
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(16);
    });

    it('Power works with empty cells', () => {
        let func = powerFunc(A + R2, D + R2);
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(1);
    });

    it('Power works with negative values as base', () => {
        let func = powerFunc(A + R3, 3);
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(-125);
    });

    it('Power works with negative values as exponent', () => {
        let func = powerFunc(A + R2, -1);
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0.5);
    });

    it('Power works with base 0', () => {
        let func = powerFunc(0, 'SUM(' + Range3 + ')');
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0);
    });

    it('Power works with negative values', () => {
        let func = powerFunc(A + R3, 3);
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(-125);
    });

    it('Sqrt works with empty cells', () => {
        let func = '=SQRT(' + D + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0);
    });

    it('Sqrt throws error with negative numbers', () => {
        let func = '=SQRT(' + B + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Sqrt of string throws error', () => {
        let func = '=SQRT(' + C + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Sqrt works works with positive numbers', () => {
        let func = '=SQRT(' + C + R2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(2);
    });

    it('Abs works with empty cells', () => {
        let func = '=ABS(' + D + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0);
    });

    it('Abs works with integer save ranges', () => {
        let func = '=ABS(' + B + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(Number.MAX_SAFE_INTEGER);
    });

    it('Abs works with positive numbers', () => {
        let func = '=ABS(' + A + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(3.36);
    });

    it('Abs throws error with input other than number', () => {
        let func = '=ABS(' + C + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe('#ARITH');
    });

    it('Floor works with empty cells', () => {
        let func = '=FLOOR(' + D + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0);
    });

    it('Floor works with integers', () => {
        let func = '=FLOOR(' + A + R2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(2);
    });

    it('Floor works with floating point numbers', () => {
        let func = '=FLOOR(' + A + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(3);
    });

    it('Floor works with negative values', () => {
        let func = '=FLOOR(' + B + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(-56);
    });

    it('Ceiling works with empty cells', () => {
        let func = '=CEIL(' + D + R4 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(0);
    });

    it('Ceiling works with integers', () => {
        let func = '=CEIL(' + A + R2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(2);
    });

    it('Ceiling works with floating point numbers', () => {
        let func = '=CEIL(' + A + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(4);
    });

    it('Ceiling works with negative values', () => {
        let func = '=CEIL(' + B + R1 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBeCloseTo(-55);
    });
});
