import React, { useState } from 'react'

import { ThemeProvider } from '../src/config'
import LoginScreen from './screens/auth/LoginScreen'
import HomeScreen from './screens/main/HomeScreen'

import Page1 from './screens/pages/Page1'
import Page2 from './screens/pages/Page2'
import Page3 from './screens/pages/Page3'
import Page4 from './screens/pages/Page4'
import Page5 from './screens/pages/Page5'
import Page6 from './screens/pages/Page6'
import Page7 from './screens/pages/Page7'
import Page8 from './screens/pages/Page8'
import Page9 from './screens/pages/Page9'
import Page10 from './screens/pages/Page10'
import Page11 from './screens/pages/Page11'
import SettingsComponent from './screens/pages/SettingsComponent'


export default function App() {

    const [screen, setScreen] = useState('login')


    // искаш да се вкара в мап и самия компонент да връща името на пейджа скрийна.
    // да го направя с контекст.
    // редукс

    function renderScreen() {

        if (screen === 'login') return <LoginScreen goTo={setScreen} />
        if (screen === 'home') return <HomeScreen goTo={setScreen} />

        if (screen === 'page1') return <Page1 goTo={setScreen} />
        if (screen === 'page2') return <Page2 goTo={setScreen} />
        if (screen === 'page3') return <Page3 goTo={setScreen} />
        if (screen === 'page4') return <Page4 goTo={setScreen} />
        if (screen === 'page5') return <Page5 goTo={setScreen} />
        if (screen === 'page6') return <Page6 goTo={setScreen} />
        if (screen === 'page7') return <Page7 goTo={setScreen} />
        if (screen === 'page8') return <Page8 goTo={setScreen} />
        if (screen === 'page9') return <Page9 goTo={setScreen} />
        if (screen === 'page10') return <Page10 goTo={setScreen} />
        if (screen === 'page11') return <Page11 goTo={setScreen} />
        if (screen === 'settings') return <SettingsComponent goTo={setScreen} />
    }

    return (
        <ThemeProvider>
            <div style={{ width: '100vw', height: '100vh' }}>
                {renderScreen()}
            </div>
        </ThemeProvider>
    )
}