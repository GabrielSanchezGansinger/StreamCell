import React from 'react';
import { contextMenuProps } from './SpreadSheet';
import { Button } from 'antd';

export default function ContextMenu({ props }: { props: contextMenuProps }) {
    return (
        <div className="contextMenu" style={props.style}>
            {props.items.map((item, id) => (
                <Button
                    className="contextMenuBtn"
                    key={`cM${id}`}
                    onClick={item.action}
                    icon={item.image}
                    id={item.text.split(' ')[1]}
                >
                    {item.text}
                </Button>
            ))}
        </div>
    );
}
