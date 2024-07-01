import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { getEval } from '../Parser/parser';

describe('Integration Tests', () => {
    let A = '$col_A';
    let B = '$col_B';
    let C = '$col_C';
    let D = '$col_D';
    let E = '$col_E';
    let R1 = '$row_1';
    let R2 = '$row_2';
    let R3 = '$row_3';
    let R4 = '$row_4';
    let R5 = '$row_5';

    let cols = [A, B, C, D, E];
    let rows = [R1, R2, R3, R4, R5];
    let data = Array(rows.length)
        .fill(0)
        .map(() => Array(cols.length).fill({ value: '', function: '' }));

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

    beforeEach(() => {
        cols = [A, B, C, D, E];
        rows = [R1, R2, R3, R4, R5];

        data = Array(rows.length)
            .fill(0)
            .map(() => Array(cols.length).fill({ value: '', function: '' }));

        data[0][0] = { value: '3.36', function: '' };
        data[0][1] = { value: '-55.60', function: '' };
        data[0][2] = { value: '70', function: '' };
        data[0][3] = { value: '99.4', function: '' };
        data[1][0] = { value: '2', function: '' };
        data[1][1] = { value: '30', function: '' };
        data[1][2] = { value: '4', function: '' };
        data[1][3] = { value: '60', function: '' };
        data[2][0] = { value: '-5', function: '' };
        data[2][1] = { value: '50', function: '' };
        data[2][2] = { value: '1', function: '' };
        data[2][3] = { value: '-7.6', function: '' };
        data[3][0] = { value: '', function: '=SUM($col_A$row_1:$col_C$row_3)' };
        data[3][1] = { value: '', function: '=SUM($col_A$row_1;$col_D$row_3)' }; //Will create a loop
        data[3][2] = { value: '', function: '=SUM($col_D$row_2;$col_D$row_4)' };
        data[3][3] = { value: '', function: '' };
    });

    /**
     *      A       B       C       D       E
     *
     * 1    3.36    -55.60  70      ""      ""
     * 2    2       30      4       ""      ""
     * 3    -5      50      1       ""      ""
     * 4    MAX     MIN     ""      ""      ""
     * 5    ""      ""      ""      ""      ""
     */
    const getInfo = () => {
        return { rows: rows, cols: cols, data: data };
    };

    const evaluate = getEval(getInfo);

    it('Deleting row of start of range reference', () => {
        let func = '=SUM(' + Range2 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(53.76);
        rows = rows.shift(); //Deletion of R1
        let func_eval2 = evaluate(func);
        expect(func_eval2).toBe('#REF');
    });

    it('Deleting row of end of range reference', () => {
        let func = '=SUM(' + Range3 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(99.4);
        rows.splice(2, 1); //Deletion of R3
        let func_eval2 = evaluate(func);
        expect(func_eval2).toBe('#REF');
    });

    it('Deleting row in the middle of range reference', () => {
        /*let func = '=SUM(' + Range3 + ')';
        let func_eval = evaluate(func);
        expect(func_eval).toBe(99.4);
        rows.splice(1, 1); //Deletion of R2
        data.splice(1);
        console.log(rows);
        let func_eval2 = evaluate(func);
        expect(func_eval2).toBe(65.4);*/
    });
});
