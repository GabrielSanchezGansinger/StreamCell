import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover, Select } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';

export default function SettingsMenu({
    roundAmmount,
    setRoundAmmount,
}: {
    roundAmmount: number;
    setRoundAmmount: Dispatch<SetStateAction<number>>;
}) {
    const popoverStyle = {
        width: 500,
        height: 200,
    };
    const [open, setOpen] = useState<boolean>(false);
    const onSettingsClick = () => {
        setOpen(!open);
    };
    const options = new Array(14).fill(0).map((_, index) => {
        return { value: index, label: index };
    });

    const onRoundChange = (value: number) => {
        setRoundAmmount(value);
    };
    return (
        <>
            <Popover
                style={popoverStyle}
                open={open}
                content={
                    <div>
                        Nachkommastellen <br />{' '}
                        <Select
                            options={options}
                            defaultValue={roundAmmount}
                            onChange={onRoundChange}
                        />
                    </div>
                }
            >
                <Button onClick={onSettingsClick}>
                    <SettingOutlined />
                </Button>
            </Popover>
        </>
    );
}
