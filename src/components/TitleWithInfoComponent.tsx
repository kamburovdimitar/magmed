import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
    title: string;
    infoHandler?: () => void;
};

export default function TitleWithInfoComponent({
    title,
    infoHandler = () => { },
}: Props) {
    return (
        <View style={styles.titleRow}>
            <Text style={styles.title}>
                {title}
            </Text>

            <Button
                title="ⓘ"
                onPress={infoHandler}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
});