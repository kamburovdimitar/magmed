import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, Button } from 'react-native'
import LabelAndInputTextComponent from '../../components/LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from '../../components/LabelAndDoubleInputComponent'
import TesMeasurmentComponent from '../TestMeasurementsComponent'
import WattMeasurmentComponent from '../WattMeasurmentComponent'
import PercentageComponent from '../PercentageComponent'
import BeuterlungComponentFiveButtons from '../BeuterlungComponentSixButtons'
import BeuterlungComponent from '../BeuterlungComponent'
import KraftComponent from '../KraftComponent'
import humanBody from '../../../assets/humanBody.jpg'
import BeuterlungTable from '../BeuterlungTable'

export default function TestComponent3() {

    const [openKraftScreen, setopenKraftScreen] = useState(false)
    const [openKSpineSreen, setOpenSpineScreen] = useState(false)
    const [openBEWEGLICHKEITScreen, setOpenBEWEGLICHKEITScreen] = useState(false)
    const [openDEHNBARKEITScreen, setOpenDEHNBARKEITScreen] = useState(false)


    function openKraftMenu(value) {
        setopenKraftScreen(value)
        setOpenSpineScreen(false)
        setOpenBEWEGLICHKEITScreen(false)
        setOpenDEHNBARKEITScreen(false)

    }

    function openSpineMenu(value) {
        setopenKraftScreen(true)
        setOpenSpineScreen(true)
    }
    function openShoulderMenu(value) { }
    function openPelvisMenu(value) { }
    function openKneeMenu(value) { }
    function openFootMenu(value) { }


    //export default function BeuterlungComponentFiveButtons({ label, openKopfMenu, openSpineMenu, openShoulderMenu, openPelvisMenu, openKneeMenu, openFootMenu }) {

    return (
        <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>

            {/* LEFT row*/}

            <View style={{ flexDirection: 'column', width: '60%', height: '100%' }}>

                <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '50%', height: '100%', flexDirection: 'column' }}>
                        <View style={{ width: '100%', height: '50%', flexDirection: 'column' }}>

                            <BeuterlungComponentFiveButtons label={true}
                                openKraftMenu={openKraftMenu}
                                openSpineMenu={openSpineMenu}
                                openShoulderMenu={openShoulderMenu}
                                openPelvisMenu={openPelvisMenu}
                                openKneeMenu={openKneeMenu}
                                openFootMenu={openKneeMenu} />

                        </View>

                        <View style={{ width: '100%', height: '50%' }}>

                            <BeuterlungComponent label={false} />

                        </View>

                    </View>

                    <View style={{ width: '50%', height: '100%', flexDirection: 'column' }}>
                        {openKSpineSreen &&
                            <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: 'red' }} >
                                {/* spacer height 20*/}
                                <View style={{ width: '100%', height: '20%', backgroundColor: 'blue' }} />

                                <View style={{ width: '100%', height: '60%', flexDirection: 'column', backgroundColor: 'red' }} >
                                    <BeuterlungTable />
                                </View>

                                {/* spacer height 20*/}
                                <View style={{ width: '100%', height: '20%', backgroundColor: 'blue' }} />

                            </View>
                        }

                    </View>

                </View>






            </View>

            {/* RIGHT row */}

            <View style={{ flexDirection: 'column', width: '40%', height: '100%', backgroundColor: "grey" }}>
                {openKraftScreen && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/body2.png')}
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