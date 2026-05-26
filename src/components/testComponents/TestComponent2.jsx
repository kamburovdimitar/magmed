import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, Button } from 'react-native'
import LabelAndInputTextComponent from '../../components/LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from '../../components/LabelAndDoubleInputComponent'
import TesMeasurmentComponent from '../TestMeasurementsComponent'
import WattMeasurmentComponent from '../WattMeasurmentComponent'
import PercentageComponent from '../PercentageComponent'
import BeuterlungComponent from '../BeuterlungComponent'
import KraftComponent from '../KraftComponent'
import humanBody from '../../../assets/humanBody.jpg'

export default function TestComponent2() {

    const [openKraftScreen, setopenKraftScreen] = useState(false)
    const [openBEWEGLICHKEITScreen, setOpenBEWEGLICHKEITScreen] = useState(false)
    const [openDEHNBARKEITScreen, setOpenDEHNBARKEITScreen] = useState(false)


    function openKraftMenu(value) {
        setopenKraftScreen(value)
        setOpenBEWEGLICHKEITScreen(false)
        setOpenDEHNBARKEITScreen(false)

    }
    function openDEHNBARKEITmenu(value) {
        setopenKraftScreen(false)
        setOpenBEWEGLICHKEITScreen(value)
        setOpenDEHNBARKEITScreen(false)
    }
    function openBEWEGLICHKEITmenu(value) {
        setopenKraftScreen(false)
        setOpenBEWEGLICHKEITScreen(false)
        setOpenDEHNBARKEITScreen(value)
    }

    return (
        <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>

            {/* LEFT row*/}

            <View style={{ flexDirection: 'column', width: '50%', height: '100%', }}>

                <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '50%', height: '100%', flexDirection: 'column' }}>
                        <View style={{ width: '100%', height: '50%', flexDirection: 'column' }}>

                            <BeuterlungComponent label={true}
                                openKraftMenu={openKraftMenu}
                                openDEHNBARKEITmenu={openDEHNBARKEITmenu}
                                openBEWEGLICHKEITmenu={openBEWEGLICHKEITmenu} />

                        </View>

                        <View style={{ width: '100%', height: '50%' }}>

                            <BeuterlungComponent label={true}
                                openKraftMenu={openKraftMenu}
                                openDEHNBARKEITmenu={openDEHNBARKEITmenu}
                                openBEWEGLICHKEITmenu={openBEWEGLICHKEITmenu} />

                        </View>

                    </View>

                    <View style={{ width: '50%', height: '100%', flexDirection: 'column' }}>
                        {openKraftScreen &&
                            <KraftComponent label={false} />}
                    </View>

                </View>






            </View>

            {/* RIGHT row */}

            <View style={{ flexDirection: 'column', width: '50%', height: '100%', backgroundColor: "grey" }}>
                {openKraftScreen && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/humanBody.jpg')}
                            style={{ width: '80%', height: '80%' }}
                            resizeMode="contain"
                        />
                    </View>
                )}

            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    fullcontainer: {
        flex: 1,

        width: '100%',
        height: '100%'

    },

    cellHeader: {
        flex: 1,
        borderWidth: 1,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    cell: {
        flex: 1,
        borderWidth: 1,
        textAlign: 'center'
    }

})