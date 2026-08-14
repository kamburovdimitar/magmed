// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature:
//   generic Yes/No confirmation modal, used to warn before "New Test" or
//   "Existing Tests" discards unsaved changes in the active test's draft.
//   Deliberately NOT built on PopupService/InfoPopUpComponent — that
//   service's shape (title/description/formula/fields/source) is tailored
//   for the info-tooltips scattered across the Test components, not a
//   plain Yes/No gate, so a small dedicated component is simpler than
//   forcing it into that shape.
// ============================================

import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';

export default function ConfirmDialogComponent({
    visible,
    message,
    onConfirm,
    onCancel
}: any) {

    return (

        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >

            <View style={styles.overlay}>

                <View style={styles.box}>

                    <Text style={styles.message}>
                        {message}
                    </Text>

                    <View style={styles.row}>

                        <Button
                            title={LanguageUtil.getName('nein')}
                            onPress={onCancel}
                        />

                        <Button
                            title={LanguageUtil.getName('ja')}
                            onPress={onConfirm}
                        />

                    </View>

                </View>

            </View>

        </Modal>

    );

}

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    box: {
        width: 420,
        maxWidth: '90%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        borderWidth: 1,
        borderColor: '#999'
    },

    message: {
        fontSize: 15,
        marginBottom: 20,
        lineHeight: 22
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10
    }

});
