import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

export default function BeuterlungTable() {

    const [selected, setSelected] = useState({});

    function handlePress(row, col) {
        setSelected({ ...selected, [row]: col });
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.headerRow}>
                <Text style={styles.headerEmpty}></Text>
                <Text style={styles.header}>schwer</Text>
                <Text style={styles.header}>mittelschwer</Text>
                <Text style={styles.header}>leicht</Text>
                <Text style={styles.header}>normal</Text>
            </View>

            {/* HWS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>HWS</Text>

                {row("Lordose", "lordose", selected, handlePress)}
                {row("Skoliose", "skoliose", selected, handlePress)}
                {row("Kyphose", "kyphose", selected, handlePress)}
                {row("Schiefhals", "schiefhals", selected, handlePress)}
                {row("Steilstellung", "steilstellung", selected, handlePress)}
            </View>

            {/* BWS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>BWS</Text>

                {row("Kyphose", "bws_kyphose", selected, handlePress)}
                {row("Skoliose", "bws_skoliose", selected, handlePress)}
                {row("Steilstellung", "bws_steil", selected, handlePress)}
            </View>

            {/* LWS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>LWS</Text>

                {row("Lordose", "lws_lordose", selected, handlePress)}
                {row("Skoliose", "lws_skoliose", selected, handlePress)}
                {row("Steilstellung", "lws_steil", selected, handlePress)}
            </View>

        </View>
    );
}


// ✅ clickable row
function row(label, rowKey, selected, handlePress) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>

            {cell(rowKey, 0, styles.red, selected, handlePress)}
            {cell(rowKey, 1, styles.orange, selected, handlePress)}
            {cell(rowKey, 2, styles.yellow, selected, handlePress)}
            {cell(rowKey, 3, styles.green, selected, handlePress)}
        </View>
    );
}


// ✅ clickable cell
function cell(rowKey, colIndex, colorStyle, selected, handlePress) {
    const isActive = selected[rowKey] === colIndex;

    return (
        <Pressable
            onPress={() => handlePress(rowKey, colIndex)}
            style={[styles.cell, colorStyle]}
        >
            <Text style={{ textAlign: "center", fontSize: 18 }}>
                {isActive ? "●" : ""}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#cfd8dc"
    },

    headerRow: {
        flexDirection: "row"
    },

    headerEmpty: {
        width: 100
    },

    header: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        borderWidth: 1,
        backgroundColor: "#90a4ae"
    },

    section: {
        marginTop: 10,
        borderWidth: 1
    },

    sectionTitle: {
        position: "absolute",
        left: -40,
        top: 10,
        transform: [{ rotate: "-90deg" }]
    },

    row: {
        flexDirection: "row"
    },

    label: {
        width: 100,
        backgroundColor: "yellow",
        borderWidth: 1
    },

    cell: {
        flex: 1,
        borderWidth: 1,
        textAlign: "center"
    },

    red: { backgroundColor: "#ef5350" },
    orange: { backgroundColor: "#ffcc80" },
    yellow: { backgroundColor: "#fff59d" },
    green: { backgroundColor: "#a5d6a7" }
});