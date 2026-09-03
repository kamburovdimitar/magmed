import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { registerPopup } from '../services/PopupService';
import LanguageUtil from '../utils/LanguageUtil';

export default function InfoPopUpComponent() {

    const [visible, setVisible] = useState(false);

    const [infoObject, setInfoObject] = useState(null);

    useEffect(() => {

        registerPopup(
            openHandler,
            closeHandler
        );

    }, []);

    function openHandler(info) {

        setInfoObject(info);

        setVisible(true);

    }

    function closeHandler() {

        setVisible(false);

        setInfoObject(null);

    }

    if (!visible)
        return null;

    return (

        <View style={styles.overlay}>

            <View style={styles.popup}>

                <Text style={styles.title}>
                    {infoObject?.title}
                </Text>

                <Text style={styles.text}>
                    {infoObject?.description}
                </Text>

                {

                    infoObject?.formula &&

                    <Text style={styles.formula}>
                        {infoObject.formula}
                    </Text>

                }

                {

                    infoObject?.fields?.length > 0 &&

                    <View style={styles.fieldsContainer}>

                        {

                            infoObject.fields.map((field, i) => (

                                <Text
                                    key={i}
                                    style={styles.field}
                                >
                                    • {field}
                                </Text>

                            ))

                        }

                    </View>

                }

                {

                    infoObject?.source &&

                    <Text style={styles.source}>

                        {LanguageUtil.getName('source_text')}: {infoObject.source}

                    </Text>

                }

                <TouchableOpacity
                    style={styles.button}
                    onPress={closeHandler}
                >

                    <Text style={styles.buttonText}>
                        {LanguageUtil.getName('schliessen')}
                    </Text>

                </TouchableOpacity>

            </View>

        </View>

    );

}

const styles = StyleSheet.create({

    overlay: {

        position: 'absolute',

        top: 0,

        left: 0,

        right: 0,

        bottom: 0,

        backgroundColor: 'rgba(0,0,0,0.45)',

        justifyContent: 'center',

        alignItems: 'center',

        zIndex: 999999

    },

    popup: {

        width: 700,

        maxWidth: '90%',

        backgroundColor: 'white',

        borderRadius: 8,

        padding: 25,

        borderWidth: 1,

        borderColor: '#999'

    },

    title: {

        fontSize: 22,

        fontWeight: 'bold',

        marginBottom: 20

    },

    text: {

        fontSize: 15,

        marginBottom: 20,

        lineHeight: 22

    },

    formula: {

        borderWidth: 1,

        borderColor: '#ddd',

        backgroundColor: '#f5f5f5',

        padding: 15,

        marginBottom: 20,

        fontFamily: 'monospace'

    },

    fieldsContainer: {

        borderWidth: 1,

        borderColor: '#ddd',

        backgroundColor: '#fafafa',

        padding: 15,

        marginBottom: 20

    },

    field: {

        fontSize: 14,

        lineHeight: 22,

        marginVertical: 2

    },

    source: {

        fontSize: 12,

        color: '#666',

        fontStyle: 'italic',

        marginBottom: 20

    },

    button: {

        alignSelf: 'flex-end',

        borderWidth: 1,

        borderColor: '#999',

        paddingHorizontal: 20,

        paddingVertical: 8,

        borderRadius: 4

    },

    buttonText: {

        fontWeight: 'bold'

    }

});