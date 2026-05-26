import React, { useState } from 'react'
import { View, Button, StyleSheet } from 'react-native'

import Page1 from '../pages/Page1'
import Page2 from '../pages/Page2'
import Page3 from '../pages/Page3'
import Page4 from '../pages/Page4'
import Page5 from '../pages/Page5'
import Page6 from '../pages/Page6'
import Page7 from '../pages/Page7'
import Page8 from '../pages/Page8'
import Page9 from '../pages/Page9'
import Page10 from '../pages/Page10'
import Page11 from '../pages/Page11'
import Page12 from '../pages/Page12'
import SettingsComponent from '../pages/SettingsComponent'

export default function HomeScreen({ goTo }) {

  const [page, setPage] = useState('page4')

  function renderPage() {
    if (page === 'page1') return <Page1 goTo={goTo} />
    if (page === 'page2') return <Page2 goTo={goTo} />
    if (page === 'page3') return <Page3 goTo={goTo} />
    if (page === 'page4') return <Page4 goTo={goTo} />
    if (page === 'page5') return <Page5 goTo={goTo} />
    if (page === 'page6') return <Page6 goTo={goTo} />
    if (page === 'page7') return <Page7 goTo={goTo} />
    if (page === 'page8') return <Page8 goTo={goTo} />
    if (page === 'page9') return <Page9 goTo={goTo} />
    if (page === 'page10') return <Page10 goTo={goTo} />
    if (page === 'page11') return <Page11 goTo={goTo} />
    if (page === 'page12') return <Page12 goTo={goTo} />
    if (page === 'settings') return <SettingsComponent goTo={goTo} />
  }

  return (
    <View style={styles.wrapper}>

      <View style={styles.header}>

        <Button title="Page 1" onPress={() => setPage('page1')} />
        <Button title="Page 2" onPress={() => setPage('page2')} />
        <Button title="Page 3" onPress={() => setPage('page3')} />
        <Button title="Page 4 (Search)s" onPress={() => setPage('page4')} />
        <Button title="Page 5 - Save " onPress={() => setPage('page5')} />
        <Button title="Page 6 - Print" onPress={() => setPage('page6')} />
        <Button title="Page 7 - Search" onPress={() => setPage('page7')} />
        <Button title="Page 8 - Line" onPress={() => setPage('page8')} />
        <Button title="Page 9  (Results)" onPress={() => setPage('page9')} />
        <Button title="Page 10 - Heart" onPress={() => setPage('page10')} />
        <Button title="Page 11 - Laktat" onPress={() => setPage('page11')} />
          <Button title="Page 12 - exercise" onPress={() => setPage('page12')} />
        <Button title="Settings" onPress={() => setPage('settings')} />

        <Button title="Logout" onPress={() => goTo('login')} />

      </View>

      <View style={styles.content}>
        {renderPage()}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  wrapper: {
    //backgroundColor:"yellow",
    
    flex: 1,
      width: "100%",
      height: "100%",
    borderWidth: 1,
  },

  header: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1
  },

  content: {
    flex: 1,
    padding: 20
  }

})