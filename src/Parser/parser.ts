import grammar from './grammar.ohm-bundle';
import { Cell } from '../App/PageComponents/SpreadSheet';
import {
    ArithmeticError,
    ReferenceError,
    DivisionByZeroError,
} from './ParserError';
import { YMap } from 'yjs/dist/src/internals';

export const getSemantics = (
    info: () => { rows: string[]; cols: string[]; data: YMap<YMap<Cell>> }
) => {
    const semantic = grammar.createSemantics();

    semantic.addOperation<any>('eval', {
        NUMBER_fract(_minus, _arg1, _arg2, _arg3) {
            return parseFloat(this.sourceString);
        },
        NUMBER_whole(_minus, _arg1) {
            return parseInt(this.sourceString);
        },
        NUMBER_pi(minus, _arg1) {
            if (minus.sourceString === '-') return -Math.PI;
            return Math.PI;
        },
        NUMBER_euler(minus, _arg1) {
            if (minus.sourceString === '-') return -Math.E;
            return Math.E;
        },

        /**
         * Performs addition on all arguments
         * SUM will ignore the empty cells
         */
        MULTIFUNCTION_sum(funcName, args, _endParen) {
            const args_array = args.eval();
            const args_length = args_array.length;
            let res = 0;

            for (let i = 0; i < args_length; i++) {
                if (args_array[i] === '') {
                    continue;
                } else if (typeof args_array[i] === 'number') {
                    res += args_array[i];
                } else {
                    throw new ArithmeticError(funcName.sourceString);
                }
            }
            return res;
        },
        /**
         * Performs multiplication on all arguments
         * MULT will ignore the empty cells
         */
        MULTIFUNCTION_mult(funcName, args, _endParen) {
            const args_array = args.eval();

            const args_array_filtered = args_array.filter(
                (element: any) => element !== ''
            );
            const args_length = args_array_filtered.length;
            if (args_length === 0) return 0;

            let res = 1;
            for (let i = 0; i < args_length; i++) {
                if (typeof args_array_filtered[i] === 'number') {
                    res *= args_array_filtered[i];
                } else {
                    throw new ArithmeticError(funcName.sourceString);
                }
            }

            return res;
        },
        /**
         * Calculates the minimum of all arguments
         * MIN will ignore the empty cells
         * MIN will return 0 if args is empty
         */
        MULTIFUNCTION_min(funcName, args, _endParen) {
            const args_array = args.eval();
            if (
                args_array.some(
                    (element: any) =>
                        !(typeof element === 'number' || element === '')
                )
            ) {
                throw new ArithmeticError(funcName.sourceString);
            }
            const args_array_filtered = args_array.filter(
                (element: any) => element !== ''
            );
            if (args_array_filtered.length === 0) return 0;
            return Math.min(...args_array_filtered);
        },
        /**
         * Calculates the maximum of all arguments
         * MAX will ignore the empty cells
         * MAX will return 0 if args is empty
         */
        MULTIFUNCTION_max(funcName, args, _endParen) {
            const args_array = args.eval();
            if (
                args_array.some(
                    (element: any) =>
                        !(typeof element === 'number' || element === '')
                )
            ) {
                throw new ArithmeticError(funcName.sourceString);
            }
            const args_array_filtered = args_array.filter(
                (element: any) => element !== ''
            );
            if (args_array_filtered.length === 0) return 0;
            return Math.max(...args_array_filtered);
        },
        /**
         * Will return the number of
         * non empty cells in args
         */
        MULTIFUNCTION_count(_funcName, args, _endParen) {
            const args_array = args.eval();
            const args_length = args_array.length;
            let res = 0;
            for (let i = 0; i < args_length; i++) {
                if (args_array[i] !== '') {
                    res += 1;
                }
            }
            return res;
        },
        /**
         * Calculates the average of all arguments
         * Ignores empty cells
         */
        MULTIFUNCTION_avg(funcName, args, _endParen) {
            const args_array = args.eval();
            const args_length = args_array.length;
            let sum = 0;

            for (let i = 0; i < args_length; i++) {
                if (typeof args_array[i] === 'number') {
                    sum += args_array[i];
                }
            }
            const args_array_filtered = args_array.filter(
                (element: any) => typeof element === 'number'
            );
            const args_filtered_length = args_array_filtered.length;
            if (args_filtered_length === 0) return 0;
            return sum / args_filtered_length;
        },

        /**
         * Divides the first argument by the second argument
         * Div will treat empty cells as 0
         * If divisor is 0 it will throw divide by zero error
         */
        SETFUNCTION_div(funcName, dividend, _semi, divisor, _endParen) {
            let dividend_eval = dividend.eval();
            let divisor_eval = divisor.eval();

            if (dividend_eval === '') dividend_eval = 0;
            if (divisor_eval === '') divisor_eval = 0;
            if (divisor_eval === 0) {
                throw new DivisionByZeroError();
            } else if (
                typeof dividend_eval !== 'number' ||
                typeof divisor_eval !== 'number'
            ) {
                throw new ArithmeticError(funcName.sourceString);
            }
            return dividend_eval / divisor_eval;
        },

        /**
         * Returns the remainder of dividing the
         * first argument by the second argument
         * Mod treats empty cells as 0
         * If the divisor is 0 will return a divide by zero error
         */
        SETFUNCTION_mod(funcName, dividend, _semi, divisor, _endParen) {
            let dividend_eval = dividend.eval();
            let divisor_eval = divisor.eval();

            if (dividend_eval === '') dividend_eval = 0;
            if (divisor_eval === '') divisor_eval = 0;
            if (divisor_eval === 0) {
                throw new DivisionByZeroError();
            } else if (
                typeof dividend_eval !== 'number' ||
                typeof divisor_eval !== 'number'
            ) {
                throw new ArithmeticError(funcName.sourceString);
            }
            return dividend_eval % divisor_eval;
        },

        /**
         * Substracts the second argument from the first argument
         * MINUS will treat empty cells as 0
         * Throws error if one of the arguments is not a number
         */
        SETFUNCTION_minus(funcName, minuend, _semi, subtrahend, _endParen) {
            let minuend_eval = minuend.eval();
            let subtrahend_eval = subtrahend.eval();
            if (minuend_eval === '') minuend_eval = 0;
            if (subtrahend_eval === '') subtrahend_eval = 0;
            if (
                typeof subtrahend_eval !== 'number' ||
                typeof minuend_eval !== 'number'
            ) {
                throw new ArithmeticError(funcName.sourceString);
            }

            return minuend_eval - subtrahend_eval;
        },

        /**
         * Calculates the cosine in radians
         * Throws error if argument is not a number
         */
        SETFUNCTION_cos(funcName, arg, _endParen) {
            const arg_eval = arg.eval();
            if (arg_eval === '') return 0;
            if (typeof arg_eval !== 'number')
                throw new ArithmeticError(funcName.sourceString);
            return Math.cos(arg_eval);
        },

        /**
         * Calculates the sine in radians
         * Throws error if argument is not a number
         */
        SETFUNCTION_sin(funcName, arg, _endParen) {
            const arg_eval = arg.eval();
            if (arg_eval === '') return 0;
            if (typeof arg_eval !== 'number')
                throw new ArithmeticError(funcName.sourceString);
            return Math.sin(arg_eval);
        },

        /**
         * Calculates the tangent in radians
         * Throws error if argument is not a number
         */
        SETFUNCTION_tan(funcName, arg, _endParen) {
            const arg_eval = arg.eval();
            if (arg_eval === '') return 0;
            if (typeof arg_eval !== 'number')
                throw new ArithmeticError(funcName.sourceString);
            return Math.tan(arg_eval);
        },

        /**
         * Calculates the logarithmic function to a specific base
         * First argument is the base
         * Throws error if the logarithm is undefined
         */
        SETFUNCTION_log(funcName, base, _semi, operand, _endParen) {
            const base_eval = base.eval();
            const operand_eval = operand.eval();
            if (
                typeof base_eval !== 'number' ||
                typeof operand_eval !== 'number'
            )
                throw new ArithmeticError(funcName.sourceString);

            const base_log = Math.log(base_eval);
            const operand_log = Math.log(operand_eval);

            if (!Number.isFinite(base_log) || base_log === 0) {
                throw new DivisionByZeroError();
            } else if (!Number.isFinite(operand_log)) {
                throw new ArithmeticError(funcName.sourceString);
            }

            return operand_log / base_log;
        },

        /**
         * Exponentiaition function
         * First argument is the base
         * Second argument is the exponent
         */
        SETFUNCTION_power(funcName, number, _semi, power, _endParen) {
            let number_eval = number.eval();
            let power_eval = power.eval();
            if (number_eval === '') number_eval = 0;
            if (power_eval === '') power_eval = 0;

            if (
                typeof number_eval !== 'number' ||
                typeof power_eval !== 'number'
            ) {
                throw new ArithmeticError(funcName.sourceString);
            }

            return Math.pow(number_eval, power_eval);
        },

        /**
         * Calculates the square root of a number
         * Throws an arithmetic error if the number is negative
         */
        SETFUNCTION_sqrt(funcName, number, _endParen) {
            let number_eval = number.eval();
            if (number_eval === '') number_eval = 0;
            if (typeof number_eval !== 'number') {
                throw new ArithmeticError(funcName.sourceString);
            }
            if (number_eval < 0)
                throw new ArithmeticError(funcName.sourceString);
            return Math.sqrt(number_eval);
        },

        /**
         * Calculates the absolute value of a number
         */
        SETFUNCTION_abs(funcName, number, _endParen) {
            let number_eval = number.eval();
            if (number_eval === '') number_eval = 0;
            if (typeof number_eval !== 'number') {
                throw new ArithmeticError(funcName.sourceString);
            }
            return Math.abs(number_eval);
        },

        /**
         * Rounds the number down to the neerest integer
         */
        SETFUNCTION_floor(funcName, number, _endParen) {
            let number_eval = number.eval();
            if (number_eval === '') number_eval = 0;
            if (typeof number_eval !== 'number') {
                throw new ArithmeticError(funcName.sourceString);
            }
            return Math.floor(number_eval);
        },

        /**
         * Rounds the number up to the neerest integer
         */
        SETFUNCTION_ceiling(funcName, number, _endParen) {
            let number_eval = number.eval();
            if (number_eval === '') number_eval = 0;
            if (typeof number_eval !== 'number') {
                throw new ArithmeticError(funcName.sourceString);
            }
            return Math.ceil(number_eval);
        },

        STRING(_quotes1, stringVal, _quotes2) {
            return stringVal.sourceString;
        },
        CellReference(colID, rowID) {
            const currentInfo = info();
            const columnId = colID.eval();
            const rowId = rowID.eval();
            const colIndex = currentInfo.cols.indexOf(columnId);
            const rowIndex = currentInfo.rows.indexOf(rowId);

            if (colIndex === -1) throw new ReferenceError(columnId);
            if (rowIndex === -1) throw new ReferenceError(rowId);
            //TODO If index -1 throw error
            const data_string = currentInfo.data.get(rowId)?.get(columnId)
                ?.value;
            if (!data_string) return '';
            let res = coerceIntoType(data_string);
            console.log(res);
            return res;
        },

        PartReference_col_ref(arg0, arg1) {
            return this.sourceString;
        },
        PartReference_row_ref(arg0, arg1) {
            return this.sourceString;
        },

        /**
         * Conditional statement
         */
        SETFUNCTION_if(
            _funcName,
            condition,
            _semi1,
            trueCase,
            _semi2,
            falseCase,
            _endParen
        ) {
            if (condition.eval()) {
                return trueCase.eval();
            } else {
                return falseCase.eval();
            }
        },

        LOGICARG(arg) {
            return arg.eval();
        },

        START(_equals, arg1) {
            return arg1.eval();
        },
        CONSTANT(arg0) {
            return arg0.eval();
        },

        REFERENCE_Single_reference(cellRef) {
            return [cellRef.eval()];
        },
        REFERENCE_Range_reference(colID1, rowID1, _colon, colID2, rowID2) {
            const currentInfo = info();
            const colId1_eval = colID1.eval();
            const colId2_eval = colID2.eval();
            const rowId1_eval = rowID1.eval();
            const rowId2_eval = rowID2.eval();

            let colIndexStart = currentInfo.cols.indexOf(colId1_eval);
            let colIndexEnd = currentInfo.cols.indexOf(colId2_eval);
            let rowIndexStart = currentInfo.rows.indexOf(rowId1_eval);
            let rowIndexEnd = currentInfo.rows.indexOf(rowId2_eval);

            if (colIndexStart === -1) throw new ReferenceError(colId1_eval);
            if (colIndexEnd === -1) throw new ReferenceError(colId2_eval);
            if (rowIndexStart === -1) throw new ReferenceError(rowId1_eval);
            if (rowIndexEnd === -1) throw new ReferenceError(rowId2_eval);

            let res = [];
            for (let i = rowIndexStart; i <= rowIndexEnd; i++) {
                for (let j = colIndexStart; j <= colIndexEnd; j++) {
                    const value = currentInfo.data
                        .get(currentInfo.rows[i])
                        ?.get(currentInfo.cols[j]);
                    if (!value) {
                        res.push('');
                        break;
                    }
                    var cellContent = coerceIntoType(
                        //currentInfo.data[i][j].value
                        value.value
                    );
                    res.push(cellContent);
                }
            }
            return res;
        },
        ARGUMENTS_multiple_arguments(arg0, _semi, arg1) {
            const arg = arg0.eval();
            const args = arg1.eval();
            return arg.concat(args);
        },
        ARGUMENTS_single_argument(arg0) {
            return arg0.eval();
        },
        ARGUMENT_function(func_result) {
            return [func_result.eval()];
        },
        ARGUMENT_number(number) {
            return [number.eval()];
        },
        ARGUMENT_ref(ref) {
            return ref.eval();
        },

        /**
         * Returns the comparisson between two values.
         * Throws error if the type of both values is not the same
         */
        LOGICFORMULA(formula, left, _semi, right, _endParen) {
            const left_eval = left.eval();
            const right_eval = right.eval();
            if (typeof left_eval !== typeof right_eval) {
                throw new ArithmeticError(formula.sourceString);
            }
            switch (formula.sourceString) {
                case 'LE(':
                    return left_eval <= right_eval;
                case 'GE(':
                    return left_eval >= right_eval;
                case 'EQUAL(':
                    return left_eval === right_eval;
                default:
                    return false;
            }
        },
        BOOL(_arg0) {
            const bool = this.sourceString;
            return bool === 'true';
        },
    });
    return { grammar, semantic };
};

export function getEval(
    getInfo: () => {
        rows: string[];
        cols: string[];
        data: YMap<YMap<Cell>>;
    }
) {
    const { grammar, semantic } = getSemantics(getInfo);
    return (input: string) => {
        try {
            return semantic(grammar.match(input)).eval();
        } catch (error: any) {
            if (error instanceof ReferenceError) {
                return '#REF';
            } else if (error instanceof ArithmeticError) {
                return '#ARITH';
            } else if (error instanceof DivisionByZeroError) {
                return '#DIV/0';
            } else {
                return '#SYN';
            }
        }
    };
}

function coerceIntoType(s: string): number | boolean | string {
    if (s === 'true') return true;
    if (s === 'false') return false;

    const n = parseFloat(s);
    if (Number.isNaN(n)) {
        return s ?? '';
    }
    return n;
}
