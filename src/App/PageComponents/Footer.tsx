import React from 'react';
import { Layout, Switch } from 'antd';

const { Footer } = Layout;

function MyFooter({
    connection,
    toggleDarkMode,
    defaultToggle,
}: {
    connection: string;
    toggleDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    defaultToggle: boolean;
}) {
    return (
        <Footer className="footer">
            <div id="connectionDiv">{'Connection status: ' + connection}</div>

            <div className="darkModeSwitch">
                Dark Mode Toggle:
                <Switch
                    onChange={toggleDarkMode}
                    defaultChecked={defaultToggle}
                    unCheckedChildren={'\u263C'}
                />
            </div>
        </Footer>
    );
}

export default MyFooter;
