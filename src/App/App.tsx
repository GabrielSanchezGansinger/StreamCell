import React, { useState } from 'react';
import '../css/App.css';
import MyHeader from './PageComponents/Header';
import MySpreadsheet from './PageComponents/SpreadSheet';
import MyFooter from './PageComponents/Footer';
import { Layout, ConfigProvider, theme } from 'antd';
import { setTheme } from '../utils/cssFunctions';

const { Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
    const [connection, setConnection] = useState('Connecting');

    let prefersDark = false;
    prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    const [isDarkMode, setDarkMode] = useState<boolean>(prefersDark);
    setTheme(isDarkMode ? 'dark' : 'light');

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#722ed1',
                },
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <MyHeader />
                <Content>
                    <MySpreadsheet setConnection={setConnection} />
                </Content>
                <MyFooter
                    connection={connection}
                    toggleDarkMode={setDarkMode}
                    defaultToggle={prefersDark}
                />
            </Layout>
        </ConfigProvider>
    );
}

export default App;
