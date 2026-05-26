import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import LanguageUtil from '../utils/LanguageUtil'

export default function WorkloadRow({
    value,
    type,
    setType,
    label,
    styles,
    handleBasePower,
    handlePowerIncrement,
    handleStepDuration,
    startLoad,
    powerIncrement,
    powerTimeStep

}) {

    const active = type === value

    return (
        <View>
            {/* HEADER */}
            <View style={[styles.row, { backgroundColor: '#eee' }]}>
                <View style={styles.radio} />

                <Text style={styles.cell}>
                    {LanguageUtil.getName('leistung_text')}
                </Text>

                <Text style={styles.cell}>
                    {LanguageUtil.getName('grund_belastung_text')}
                </Text>

                <Text style={styles.cell}>
                    {LanguageUtil.getName('belastungs_inkrement_text')}
                </Text>

                <Text style={styles.cell}>
                    {LanguageUtil.getName('zeit_inkrement_text')}
                </Text>
            </View>

            {/* ROW */}
            <View style={styles.row}>
                <TouchableOpacity onPress={() => setType(value)} style={styles.radio}>
                    <Text>{active ? '🔘' : '⚪'}</Text>
                </TouchableOpacity>

                <Text style={styles.cell}>{label}</Text>

                <TextInput
                    style={[styles.input, !active && styles.disabled]}
                    value={startLoad}
                    onChangeText={handleBasePower}
                    editable={active}
                />

                <TextInput
                    style={[styles.input, !active && styles.disabled]}
                    value={powerIncrement}
                    onChangeText={handlePowerIncrement}
                    editable={active}
                />

                <TextInput
                    style={[styles.input, !active && styles.disabled]}
                    value={powerTimeStep}
                    onChangeText={handleStepDuration}
                    editable={active}
                />
            </View>
        </View>
    )
}