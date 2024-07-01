import * as Y from 'yjs';
import React from 'react';
import { WebsocketProvider } from 'y-websocket';
import {
    useEffect,
    useState,
    SetStateAction,
    Dispatch,
    useCallback,
    useReducer,
} from 'react';
import { Button, Input } from 'antd';
import { Map, YEvent } from 'yjs';
import ContextMenu from './ContextMenu';
import { base26ToDecimal, decimalToBase26 } from '../../utils/base26Converter';
import uid from '../../utils/uniqueID';
import {
    LeftOutlined,
    RightOutlined,
    UpOutlined,
    DownOutlined,
    DeleteOutlined,
    SelectOutlined,
} from '@ant-design/icons';
import { getEval } from '../../Parser/parser';
import {
    checkCircularReference,
    transform_to_ExcelRef,
    transform_to_UID,
} from '../../utils/transformIDs';
import SettingsMenu from './SettingsMenu';

const yDoc = new Y.Doc();
const websocketProvider = new WebsocketProvider(
    'ws://localhost:1234',
    'spreadsheetData',
    yDoc
);

export type Cell = {
    value: string;
    function: string;
};

enum StateActionType {
    UpdateColumns = 'UpdateColumns',
    UpdateRows = 'UpdateRows',
    ChangeValue = 'ChangeValue',
    SetInitial = 'SetInitial',
    SetData = 'SetData',
}

interface StateAction {
    type: StateActionType;
    payload: StatePayload;
}

interface StatePayload {
    id?: string;
    rowId?: string;
    colId?: string;
    data?: Cell[][];
    cols?: string[];
    rows?: string[];
}

interface State {
    cols: string[];
    rows: string[];
    data: Cell[][];
}

const yMap = yDoc.getMap<Map<Cell>>('spreadsheet');
const yColumns = yDoc.getArray<string>('columns');
const yRows = yDoc.getArray<string>('rows');
const yColKeep = yDoc.getMap<Y.Array<number>>('column-keep');
const yRowKeep = yDoc.getMap<Y.Array<number>>('row-keep');
const yFunctionKeep = yDoc.getMap<Map<number>>('function-keep');

enum AddAction {
    Left,
    Right,
}

export type menuItems = {
    text: string;
    image: React.ReactNode;
    action: () => void;
};

export type contextMenuProps = {
    isOpen: boolean;
    items: menuItems[];
    style: { visible: boolean; left: number; top: number };
};

const INITIAL_VALUE = -1;

function MySpreadsheet({
    setConnection,
}: {
    setConnection: Dispatch<SetStateAction<string>>;
}) {
    const [roundAmmount, setRoundAmmount] = useState<number>(6);
    function stateReducer(state: State, action: StateAction) {
        const { type, payload } = action;
        switch (type) {
            case StateActionType.UpdateColumns: {
                let tempCol: string[] = [];
                for (let index = 0; index < yColumns.length; index++) {
                    const element = yColumns.get(index);
                    if (yColKeep.get(element)?.length !== 0) {
                        tempCol.push(element);
                    }
                }
                let deleted = state.cols.filter((x) => !tempCol.includes(x));
                let added = tempCol.filter((x) => !state.cols.includes(x));

                let tempData = [...state.data];

                if (
                    state.data.length > 0 &&
                    state.data[0].length > tempCol.length
                ) {
                    for (let i = deleted.length - 1; 0 <= i; i--) {
                        let deletedCol = deleted[i];
                        const colIndex = state.cols.indexOf(deletedCol);
                        if (colIndex !== -1) {
                            state.data.forEach((row, rowIndex) => {
                                let tempRow = row;
                                tempRow.splice(colIndex, 1);
                                tempData[rowIndex] = tempRow;
                            });
                        }
                    }
                }

                for (let i = 0; i < added.length; i++) {
                    let addedCol = added[i];
                    if (!state.cols.includes(addedCol)) {
                        if (state.data[0].length < tempCol.length) {
                            let colIndex = tempCol.indexOf(addedCol);
                            state.data.forEach((row, index) => {
                                let tempRow = row;
                                tempRow.splice(colIndex, 0, {
                                    value: '',
                                    function: '',
                                });
                                tempData[index] = tempRow;
                            });
                        }
                    }
                }

                return { ...state, cols: tempCol, data: tempData };
            }
            case StateActionType.UpdateRows: {
                let tempRow: string[] = [];
                for (let index = 0; index < yRows.length; index++) {
                    const element = yRows.get(index);
                    if (!(yRowKeep.get(element)?.length === 0)) {
                        tempRow.push(element);
                    }
                }

                let deleted = state.rows.filter((x) => !tempRow.includes(x));
                let added = tempRow.filter((x) => !state.rows.includes(x));

                let tempData = [...state.data];
                for (let i = deleted.length; i >= 0; i--) {
                    let deletedRow = deleted[i];
                    let rowIndex = state.rows.indexOf(deletedRow);
                    if (rowIndex !== -1) {
                        tempData.splice(rowIndex, 1);
                    }
                }

                for (let i = 0; i < added.length; i++) {
                    let addedRow = added[i];
                    //Insert a new array of length col at index row filled with empty rows
                    const rowIndex = tempRow.indexOf(addedRow);

                    const newRowArray = new Array(state.cols.length).fill({
                        value: '',
                        function: '',
                    });
                    tempData.splice(rowIndex, 0, newRowArray);
                }

                return { ...state, rows: tempRow, data: tempData };
            }

            case StateActionType.ChangeValue: {
                const rowId = payload.rowId;
                const colId = payload.colId;
                if (!rowId || !colId) return state;

                const rowIndex = state.rows.indexOf(rowId);
                const colIndex = state.cols.indexOf(colId);
                let tempData = [...state.data];

                const nestedMap = yMap.get(rowId);
                const cell = nestedMap?.get(colId);

                if (cell) {
                    tempData[rowIndex][colIndex] = cell;
                }

                return { ...state, data: tempData };
            }
            case StateActionType.SetData: {
                if (!payload.data) return state;
                return { ...state, data: payload.data };
            }
            case StateActionType.SetInitial: {
                if (!payload.cols || !payload.rows || !payload.data)
                    return state;
                return {
                    ...state,
                    cols: payload.cols,
                    rows: payload.rows,
                    data: payload.data,
                };
            }
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(stateReducer, {
        rows: [],
        cols: [],
        data: [],
    });

    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [functionInput, setFunctionInput] = useState<string>();
    const [selectedCell, setSelectedCell] = useState({
        col: -1,
        row: -1,
        style: { border: '2px solid #722ed1' },
    });
    const [isSelecting, setIsSelecting] = useState<boolean>(false);

    const [contextMenuProps, setContextMenuProps] = useState<contextMenuProps>({
        isOpen: false,
        items: [],
        style: { visible: false, left: 0, top: 0 },
    });

    const getInfo = () => {
        let tempRow: string[] = [];
        for (let index = 0; index < yRows.length; index++) {
            const element = yRows.get(index);
            if (!(yRowKeep.get(element)?.length === 0)) {
                tempRow.push(element);
            }
        }
        let tempCol: string[] = [];
        for (let index1 = 0; index1 < yColumns.length; index1++) {
            const element = yColumns.get(index1);
            if (!(yColKeep.get(element)?.length === 0)) {
                tempCol.push(element);
            }
        }
        return { rows: tempRow, cols: tempCol, data: yMap };
    };

    const evaluate = getEval(getInfo);

    useEffect(() => {
        //Add event listener for connection to websocket
        websocketProvider.on('status', (event: any) => {
            setConnection(event.status);
        });

        websocketProvider.once('sync', () => {
            if (yRows.length === 0) {
                init();
            } else {
                re_render();
            }
        });
    }, [setConnection]);

    useEffect(() => {}, [state]);
    useEffect(() => {
        let mapObserver = observeData;
        let colKeepObserver = observeColKeep;
        let rowKeepObserver = observeRowkeep;

        yMap.observeDeep(mapObserver);
        yColKeep.observeDeep(colKeepObserver);
        yRowKeep.observeDeep(rowKeepObserver);

        return () => {
            yColKeep.unobserveDeep(colKeepObserver);
            yRowKeep.unobserveDeep(rowKeepObserver);
            yMap.unobserveDeep(mapObserver);
        };
    }, []);

    useEffect(() => {
        re_render();
    }, [roundAmmount]);

    const observeData = useCallback((_: any, transaction: Y.Transaction) => {
        transaction.changed.forEach((change, key) => {
            if (!change.has(null)) {
                const rowId = key._item?.parentSub;
                if (!rowId) return;
                change.forEach((colId) => {
                    if (colId) {
                        dispatch({
                            type: StateActionType.ChangeValue,
                            payload: { rowId: rowId, colId: colId },
                        });
                    }
                });
            }
        });

        yFunctionKeep.forEach((funKeepNestedMap, row) => {
            funKeepNestedMap.forEach((value, col) => {
                if (value !== -1) {
                    const nestedMap = yMap.get(row);

                    const cell = nestedMap?.get(col);
                    if (cell) {
                        const evalValue = evaluate(cell.function);
                        if (!(cell.value === evalValue)) {
                            nestedMap?.set(col, {
                                value: evalValue,
                                function: cell.function,
                            });
                        }
                    }
                }
            });
        });
    }, []);
    const observeRowkeep = useCallback((event: Y.YEvent<any>[]) => {
        event.forEach((subEvent) => {
            dispatch({ type: StateActionType.UpdateRows, payload: {} });
        });
    }, []);

    const observeColKeep = useCallback(
        (event: Y.YEvent<any>[], transaction: Y.Transaction) => {
            dispatch({ type: StateActionType.UpdateColumns, payload: {} });
        },
        []
    );
    /**
     * re-render app with new state
     * information stored in yjs
     */
    const re_render = () => {
        let tempRow: string[] = [];
        let tempCol: string[] = [];
        for (let index = 0; index < yRows.length; index++) {
            const element = yRows.get(index);
            if (!(yRowKeep.get(element)?.length === 0)) {
                tempRow.push(element);
            }
        }
        for (let index1 = 0; index1 < yColumns.length; index1++) {
            const element = yColumns.get(index1);
            if (!(yColKeep.get(element)?.length === 0)) {
                tempCol.push(element);
            }
        }

        let tempData = Array(tempRow.length)
            .fill(0)
            .map((x: number) =>
                Array(tempCol.length).fill({ value: '', function: '' })
            );

        tempRow.forEach((rowName, rowIndex) => {
            let nestedMap = yMap.get(rowName);
            if (nestedMap) {
                tempCol.forEach((colName, colIndex) => {
                    let cell = nestedMap?.get(colName);
                    if (cell) {
                        if (!(cell.function === '')) {
                            const evalValue = evaluate(cell.function);
                            if (!(cell.value === evalValue))
                                nestedMap?.set(colName, {
                                    value: evalValue,
                                    function: cell.function,
                                });
                            tempData[rowIndex][colIndex] = {
                                function: cell.function,
                                value: evalValue,
                            };
                            //}
                        } else {
                            tempData[rowIndex][colIndex] = cell;
                        }
                    }
                });
            }
        });
        dispatch({
            type: StateActionType.SetInitial,
            payload: { data: tempData, rows: tempRow, cols: tempCol },
        });
    };

    const onCellClick = (
        event: React.MouseEvent<HTMLInputElement>,
        rowIndex: number,
        colIndex: number
    ) => {
        if (!isSelecting) {
            setSelectedCell({ ...selectedCell, row: rowIndex, col: colIndex });

            setFunctionInput(
                transform_to_ExcelRef(
                    state.cols,
                    state.rows,
                    state.data[rowIndex][colIndex].function
                )
            );
        } else {
            if (selectedCell.col === -1 && selectedCell.row === -1) {
                setSelectedCell({
                    ...selectedCell,
                    row: rowIndex,
                    col: colIndex,
                });

                setFunctionInput(
                    transform_to_ExcelRef(
                        state.cols,
                        state.rows,
                        state.data[rowIndex][colIndex].function
                    )
                );
                return;
            }
            if (functionInput?.at(-1) === ':') {
                setFunctionInput(functionInput + event.currentTarget.id);
                setIsSelecting(false);
            } else {
                setFunctionInput(functionInput + event.currentTarget.id + ':');
            }
        }
    };
    const onChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        rowIndex: number,
        colIndex: number
    ) => {
        const newData = [...state.data];
        newData[rowIndex][colIndex] = {
            value: event.target.value,
            function: '',
        };
        if (!hasChanged) setHasChanged(true);
        dispatch({ type: StateActionType.SetData, payload: { data: newData } });
    };

    const onBlur = (
        event: React.FocusEvent<HTMLInputElement>,
        rowIndex: number,
        colIndex: number
    ) => {
        if (!hasChanged) return;
        let value = event.target.value;
        let rowId = state.rows[rowIndex];
        let colId = state.cols[colIndex];
        const nestedMap = yMap.get(rowId);
        const keepColArray = yColKeep.get(colId);
        const keepRowArray = yRowKeep.get(rowId);
        let functionKeepNestedMap = yFunctionKeep.get(rowId);
        let functionKeepValue = functionKeepNestedMap?.get(colId);

        if (!nestedMap || !keepColArray || !keepRowArray) return;

        yDoc.transact((tr) => {
            //deletion and adding of value in keepCol
            keepColArray.delete(0, keepColArray.length);
            keepColArray.push([yDoc.clientID + counter]);
            //deletion and adding of value in keepRow
            keepRowArray.delete(0, keepRowArray.length);
            keepRowArray.push([yDoc.clientID + counter]);
            if (
                functionKeepNestedMap &&
                typeof functionKeepValue === 'number' &&
                functionKeepValue !== -1
            ) {
                functionKeepNestedMap.set(colId, -1);
            }
            //setting of the value
            nestedMap.set(colId, { value: value, function: '' });
        });

        setCounter(counter + 1);
        setHasChanged(false);
    };

    const handleInsertCol = (colIndex: number, action: number) => () => {
        if (!(action === 0) && !(action === 1)) {
            throw Error('Wrong Action for Insert Column!');
        }
        const selectedColumn = state.cols[colIndex];
        let indexInCRDT = 0;
        for (let i = 0; i < yColumns.length; i++) {
            if (yColumns.get(i) === selectedColumn) {
                indexInCRDT = i;
                break;
            }
        }
        const newUID = '$col_' + uid();
        const colKeepArray = new Y.Array<number>();
        yDoc.transact((tr) => {
            //ACTION is defined as 0 for left and 1 for right. If this changes this will be wrong!
            yColumns.insert(indexInCRDT + action, [newUID]);
            //Update keep column with new entry for the new column
            colKeepArray.push([INITIAL_VALUE]);
            yColKeep.set(newUID, colKeepArray);
        });
    };

    const handleInsertRow = (rowIndex: number, action: number) => () => {
        if (!(action === 0) && !(action === 1)) {
            throw Error('Wrong Action for Insert Rows!');
        }
        const selectedRow = state.rows[rowIndex];
        let indexInCRDT = 0;
        for (let i = 0; i < yRows.length; i++) {
            if (yRows.get(i) === selectedRow) {
                indexInCRDT = i;
                break;
            }
        }
        const newUID = '$row_' + uid();
        const rowKeepArray = new Y.Array<number>();
        let newNestedMap = new Y.Map<Cell>();

        yDoc.transact((tr) => {
            //ACTION is defined as 0 for top and 1 for bottom. If this changes this will be wrong!
            yRows.insert(indexInCRDT + action, [newUID]);
            //Update keepRow Array with new entry for new row
            rowKeepArray.push([INITIAL_VALUE]);
            yRowKeep.set(newUID, rowKeepArray);

            //Update the map with a new nested map
            yMap.set(newUID, newNestedMap);
        });
    };

    const handleDeleteCol = (colIndex: number) => () => {
        const colId = state.cols[colIndex];
        let colKeepArray = yColKeep.get(colId);
        if (!colKeepArray) return;
        colKeepArray.delete(0, colKeepArray.length);
    };

    const handleDeleteRow = (rowIndex: number) => () => {
        const rowId = state.rows[rowIndex];
        let rowKeepArray = yRowKeep.get(rowId);
        if (!rowKeepArray) return;
        rowKeepArray.delete(0, rowKeepArray.length);
    };

    function columnContextMenuItems(colIndex: number) {
        return [
            {
                text: 'Insert left',
                image: <LeftOutlined />,
                action: handleInsertCol(colIndex, AddAction.Left),
            },
            {
                text: 'Delete column',
                image: <DeleteOutlined />,
                action: handleDeleteCol(colIndex),
            },
            {
                text: 'Insert right',
                image: <RightOutlined />,
                action: handleInsertCol(colIndex, AddAction.Right),
            },
        ];
    }

    function rowContextMenuItems(rowIndex: number) {
        return [
            {
                text: 'Insert above',
                image: <UpOutlined />,
                action: handleInsertRow(rowIndex, AddAction.Left),
            },
            {
                text: 'Delete row',
                image: <DeleteOutlined />,
                action: handleDeleteRow(rowIndex),
            },
            {
                text: 'Insert below',
                image: <DownOutlined />,
                action: handleInsertRow(rowIndex, AddAction.Right),
            },
        ];
    }

    const onContextMenu = (
        event: React.MouseEvent,
        row: number,
        col: number
    ) => {
        event.preventDefault();
        setContextMenuProps({
            isOpen: true,
            items:
                row === -1
                    ? columnContextMenuItems(col)
                    : rowContextMenuItems(row),
            style: { visible: true, left: event.clientX, top: event.clientY },
        });
    };

    const onContentClick = () => {
        setContextMenuProps({ ...contextMenuProps, isOpen: false });
    };
    const connectionToggle = () => {
        if (websocketProvider.wsconnected) {
            websocketProvider.disconnect();
        } else {
            websocketProvider.connect();
        }
    };

    const onFunctionInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFunctionInput(event.target.value);
    };

    const onFunctionInputBlur = (event: React.MouseEvent<HTMLElement>) => {
        if (!functionInput) return;
        try {
            const rowIndex = selectedCell.row;
            const colIndex = selectedCell.col;
            let rowId = state.rows[rowIndex];
            let colId = state.cols[colIndex];

            try {
                checkCircularReference(
                    state.data,
                    state.cols,
                    state.rows,
                    functionInput,
                    decimalToBase26(colIndex + 1) + rowIndex
                );
            } catch (error) {
                console.log(error);
                return;
            }

            const transformedFunc = transform_to_UID(
                state.cols,
                state.rows,
                functionInput
            ).transformedFunc;
            const evalValue = evaluate(transformedFunc);

            let nestedMap = yMap.get(rowId);
            const keepColArray = yColKeep.get(colId);
            const keepRowArray = yRowKeep.get(rowId);
            let functionKeepNestedMap = yFunctionKeep.get(rowId);
            if (!nestedMap || !keepColArray || !keepRowArray) return;

            yDoc.transact((tr) => {
                keepColArray.delete(0, keepColArray.length);
                keepColArray.push([yDoc.clientID + counter]);

                keepRowArray.delete(0, keepRowArray.length);
                keepRowArray.push([yDoc.clientID + counter]);

                if (functionKeepNestedMap) {
                    functionKeepNestedMap.set(colId, 1);
                } else {
                    let newNestedMap = new Y.Map<number>();
                    newNestedMap.set(colId, 1);
                    yFunctionKeep.set(rowId, newNestedMap);
                }

                nestedMap.set(colId, {
                    value: evalValue,
                    function: transformedFunc,
                });
            });

            setCounter(counter + 1);
            setIsSelecting(false);
        } catch (error) {
            console.log(error);
        }
    };

    const onClickClear = (_evt: React.MouseEvent<HTMLInputElement>) => {
        yDoc.transact((tr) => {
            yColumns.delete(0, yColumns.length);
            yRows.delete(0, yRows.length);
            yRowKeep.clear();
            yColKeep.clear();
            yFunctionKeep.clear();
            yMap.clear();
        });

        init();
    };

    const init = () => {
        for (let i = 0; i < 3; i++) {
            const rowUID = '$row_' + uid();
            const colUID = '$col_' + uid();

            const rowKeepArray = new Y.Array<number>();
            const colKeepArray = new Y.Array<number>();
            let newNestedMap = new Y.Map<Cell>();

            yDoc.transact((tr) => {
                yRows.push([rowUID]);
                yColumns.push([colUID]);

                rowKeepArray.push([INITIAL_VALUE]);
                yRowKeep.set(rowUID, rowKeepArray);

                colKeepArray.push([INITIAL_VALUE]);
                yColKeep.set(colUID, colKeepArray);

                yMap.set(rowUID, newNestedMap);
            });
        }
        re_render();
    };

    return (
        <div className="content" onClick={onContentClick}>
            <div>
                <Input
                    id="functionInput"
                    value={functionInput}
                    onChange={onFunctionInputChange}
                ></Input>
                <Button
                    danger={isSelecting}
                    onClick={() => {
                        setIsSelecting(!isSelecting);
                    }}
                    icon={<SelectOutlined />}
                >
                    {' '}
                    Selection
                </Button>
                <Button
                    id="functionInputButton"
                    type="primary"
                    onClick={onFunctionInputBlur}
                >
                    Input
                </Button>

                <SettingsMenu
                    roundAmmount={roundAmmount}
                    setRoundAmmount={setRoundAmmount}
                />
            </div>
            <table id="spreadSheet">
                <thead>
                    <tr className="headerRow">
                        <th />
                        {state.cols.map((col, colIndex) => (
                            <th
                                key={'Col' + colIndex}
                                onContextMenu={(event) =>
                                    onContextMenu(event, -1, colIndex)
                                }
                                id={'ColHead' + decimalToBase26(colIndex + 1)}
                            >
                                {' '}
                                {decimalToBase26(colIndex + 1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {state.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <th
                                className="rowHeaders"
                                key={'header' + rowIndex}
                                onContextMenu={(event) =>
                                    onContextMenu(event, rowIndex, -1)
                                }
                                id={'RowHead' + rowIndex}
                            >
                                {rowIndex}
                            </th>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={'cell' + rowIndex + '/' + cellIndex}
                                    style={
                                        selectedCell.col === cellIndex &&
                                        selectedCell.row === rowIndex
                                            ? selectedCell.style
                                            : undefined
                                    }
                                >
                                    <input
                                        type="text"
                                        value={cell.value}
                                        onClick={(event) =>
                                            onCellClick(
                                                event,
                                                rowIndex,
                                                cellIndex
                                            )
                                        }
                                        title={cell.value}
                                        onChange={(event) =>
                                            onChange(event, rowIndex, cellIndex)
                                        }
                                        onBlur={(event) =>
                                            onBlur(event, rowIndex, cellIndex)
                                        }
                                        id={
                                            decimalToBase26(cellIndex + 1) +
                                            rowIndex
                                        }
                                    ></input>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <Button
                    id="connectionButton"
                    onClick={(event) => connectionToggle()}
                    type="primary"
                >
                    {websocketProvider.wsconnected ? 'Disconnect' : 'Connect'}
                </Button>
                <Button id="clearButton" type="primary" onClick={onClickClear}>
                    Clear
                </Button>
            </div>
            <div className="json">
                <div>
                    <span>Map</span>
                    {'\n'}
                    {JSON.stringify(yMap.toJSON(), null, '  ')}
                </div>
                <div>
                    <span>Columns</span>
                    {'\n'}
                    {JSON.stringify(yColumns.toJSON(), null, '  ')}
                </div>
                <div>
                    <span>Rows</span>
                    {'\n'}
                    {JSON.stringify(yRows.toJSON(), null, '  ')}
                </div>
                <div>
                    <span>ColKeep</span>
                    {'\n'}
                    {JSON.stringify(yColKeep.toJSON(), null, '  ')}
                </div>
                <div>
                    <span>RowKeep</span>
                    {'\n'}
                    {JSON.stringify(yRowKeep.toJSON(), null, '  ')}
                </div>
                <div>
                    <span>FunctionKeep</span>
                    {'\n'}
                    {JSON.stringify(yFunctionKeep.toJSON(), null, '  ')}
                </div>
            </div>

            {contextMenuProps.isOpen && (
                <ContextMenu props={contextMenuProps} />
            )}
        </div>
    );
}

export default MySpreadsheet;
