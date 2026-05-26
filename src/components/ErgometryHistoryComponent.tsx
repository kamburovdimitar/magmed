import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ErgometryHistoryComponent({
    reports,
    onApply
}: any) {

    if (!reports || reports.length === 0) {

        return (
            <View>
                <Text>
                    No archived reports
                </Text>
            </View>
        );
    }

    return (

        <View>

            {
                reports.map((item: any, index: number) => (

                    <View
                        key={index}
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            marginBottom: 10
                        }}
                    >

                        <Text>
                            Date:
                            {' '}
                            {item.createdAt}
                        </Text>

                        <Text>
                            Model:
                            {' '}
                            {item?.ergometry?.model}
                        </Text>

                        <Text>
                            IAS:
                            {' '}
                            {item?.result?.IAS}
                        </Text>

                        <Text>
                            IANS:
                            {' '}
                            {item?.result?.IANS}
                        </Text>

                        <Button
                            title="Apply"
                            onPress={() => {

                                onApply(item);
                            }}
                        />

                    </View>
                ))
            }

        </View>
    );
}