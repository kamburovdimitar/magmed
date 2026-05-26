import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function TestPanelResultComponent() {

    const html = `
        <h2>Match Results</h2>

        <table border="1" style="border-collapse:collapse;width:100%">
            <tr>
                <th>Player</th>
                <th>Set1</th>
                <th>Set2</th>
                <th>Set3</th>
            </tr>
            <tr>
                <td>Nadal</td>
                <td>6</td>
                <td>3</td>
                <td>6</td>
            </tr>
            <tr>
                <td>Djokovic</td>
                <td>4</td>
                <td>6</td>
                <td>2</td>
            </tr>
        </table>
    `

    return (
        <View style={styles.container}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1
    }
})