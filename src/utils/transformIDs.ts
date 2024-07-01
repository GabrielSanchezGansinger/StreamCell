import { Cell } from '../App/PageComponents/SpreadSheet';
import { CircularReferenceError } from '../Parser/ParserError';
import { Stack } from './Stack';
import { base26ToDecimal, decimalToBase26 } from './base26Converter';

export const transform_to_UID = (
    cols: string[],
    rows: string[],
    input: string
) => {
    const chars = [...input];
    let res = '';
    let alphaRegex = /[A-Z]/g;
    let digitRegex = /[0-9]/g;
    let lastCharWasCapital = false;
    let lastCharWasRowRef = false;
    let inString = false;
    let justFinishedWithRef = false;
    let isRangeRef = false;
    let currentColRef = '';
    let currentRowRef = '';
    let referencesPassed: string[] = [];
    chars.forEach((char) => {
        if (!inString) {
            if (char === '"') {
                inString = true;
                res += char;
            } else if (
                !lastCharWasCapital &&
                !lastCharWasRowRef &&
                char.match(alphaRegex)
            ) {
                lastCharWasCapital = true;
                currentColRef += char;
            } else if (lastCharWasCapital && char.match(alphaRegex)) {
                currentColRef += char;
            } else if (lastCharWasCapital && !char.match(digitRegex)) {
                res += currentColRef;
                currentColRef = '';
                lastCharWasCapital = false;
                res += char;
            } else if (lastCharWasCapital && char.match(digitRegex)) {
                lastCharWasRowRef = true;
                lastCharWasCapital = false;
                if (isRangeRef) {
                    referencesPassed[referencesPassed.length - 1] =
                        referencesPassed[referencesPassed.length - 1] +
                        '/' +
                        currentColRef;
                    isRangeRef = false;
                } else {
                    referencesPassed.push(currentColRef);
                }
                res += cols[base26ToDecimal(currentColRef) - 1];
                currentColRef = '';
                currentRowRef += char;
            } else if (lastCharWasRowRef && char.match(digitRegex)) {
                currentRowRef += char;
            } else if (lastCharWasRowRef && !char.match(digitRegex)) {
                lastCharWasRowRef = false;
                referencesPassed[referencesPassed.length - 1] =
                    referencesPassed[referencesPassed.length - 1] +
                    currentRowRef;
                res += rows[parseInt(currentRowRef)];
                currentRowRef = '';
                if (char === ':') {
                    isRangeRef = true;
                    res += char;
                } else {
                    res += char;
                }
            } else {
                res += char;
            }
        } else {
            if (char === '"') {
                inString = false;
                res += char;
            } else {
                res += char;
            }
        }
    });
    return { transformedFunc: res, refsPassed: referencesPassed };
};

export const transform_to_ExcelRef = (
    cols: string[],
    rows: string[],
    input: string
) => {
    const colRegex = /\$col_[A-Za-z0-9]+/g;
    const rowRegex = /\$row_[A-Za-z0-9]+/g;
    const match1 = input.replace(colRegex, (colId) => {
        return decimalToBase26(cols.indexOf(colId) + 1);
    });
    const res = match1.replace(rowRegex, (rowId) => {
        return '' + rows.indexOf(rowId);
    });
    return res;
};

const giveColAndRowIndex = (input: string) => {
    let alphaRegex = /[A-Z]+/g;
    let digitRegex = /[0-9]+/g;

    let matchedAlphaRegex = input.match(alphaRegex);
    let matchedDigitRegex = input.match(digitRegex);
    if (matchedAlphaRegex && matchedDigitRegex) {
        return {
            col: base26ToDecimal(matchedAlphaRegex.toString()) - 1,
            row: parseInt(matchedDigitRegex.toString()),
        };
    }

    return { col: -1, row: -1 };
};

const transformRangeRef = (input: string[]) => {
    let res: string[] = [];
    input.forEach((ref) => {
        if (ref.includes('/')) {
            res = res.concat(getCellsInRange(ref));
        } else {
            res.push(ref);
        }
    });
    return res;
};

function getCellsInRange(rangeRef: string): string[] {
    // Split the range reference into its starting and ending cell references
    const [startCoord, endCoord] = rangeRef.split('/');

    // Extract row and column indices from the starting and ending cell references
    const [startCol, startRow] = startCoord.match(/[A-Z]+|\d+/g)!;
    const [endCol, endRow] = endCoord.match(/[A-Z]+|\d+/g)!;

    // Convert column letters to indices
    const startColIndex = parseInt(startCol, 36) - 10; // 'A' is ASCII 65, so 'A' - 10 = 1
    const endColIndex = parseInt(endCol, 36) - 10;

    // Initialize an array to store cell references
    const cellRefs: string[] = [];

    // Iterate over rows and columns to generate all cell references within the range
    for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
        for (
            let colIndex = startColIndex;
            colIndex <= endColIndex;
            colIndex++
        ) {
            // Convert column index back to letters
            const col = String.fromCharCode(colIndex + 65); // 'A' is ASCII 65
            cellRefs.push(`${col}${row}`);
        }
    }

    return cellRefs;
}

export const checkCircularReference = (
    data: Cell[][],
    cols: string[],
    rows: string[],
    input: string,
    inputCell: string
) => {
    let passedReferences = new Stack<String>();
    passedReferences.push(inputCell);
    let remainingReferences = transform_to_UID(cols, rows, input).refsPassed;
    remainingReferences = transformRangeRef(remainingReferences);
    remainingReferences.forEach((cell) => {
        if (passedReferences.contains(cell)) throw new CircularReferenceError();
    });
    remainingReferences.forEach((cell) => {
        passedReferences.push(cell);
        let indices = giveColAndRowIndex(cell);
        let func = data[indices.row][indices.col].function;
        if (func !== '') {
            let transformedFunc = transform_to_ExcelRef(cols, rows, func);
            checkCircularReferenceInternal(
                data,
                cols,
                rows,
                transformedFunc,
                passedReferences
            );
        }
        passedReferences.pop();
    });
};

const checkCircularReferenceInternal = (
    data: Cell[][],
    cols: string[],
    rows: string[],
    input: string,
    currentStack: Stack<String>
) => {
    let remainingReferences = transform_to_UID(cols, rows, input).refsPassed;
    remainingReferences = transformRangeRef(remainingReferences);
    remainingReferences.forEach((cell) => {
        if (currentStack.contains(cell)) throw new CircularReferenceError();
    });
    remainingReferences.forEach((cell) => {
        currentStack.push(cell);
        let indices = giveColAndRowIndex(cell);
        let func = data[indices.row][indices.col].function;
        if (func !== '') {
            let transformedFunc = transform_to_ExcelRef(cols, rows, func);
            checkCircularReferenceInternal(
                data,
                cols,
                rows,
                transformedFunc,
                currentStack
            );
        }
        currentStack.pop();
    });
};
