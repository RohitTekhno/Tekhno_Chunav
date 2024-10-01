import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Octicons,AntDesign,FontAwesome6} from 'react-native-vector-icons/';



const TopNavCompo = ({ navigation, ScreenName, colorName }) => {
    const handleGoBack = () => {
        navigation.goBack();
    };



    return (
        <View style={styles.nav}>
            <Pressable onPress={handleGoBack}>
                <Octicons name="chevron-left" size={26} color={colorName} />
            </Pressable>

            <Text style={[styles.text, { color: colorName ? colorName : 'black' }]}>{ScreenName}</Text>

            <Pressable onPress={() => navigation.navigate('ContactUs')}>
                <FontAwesome6 name="phone" size={24} color={colorName ? colorName : 'black'} />
            </Pressable>
        </View>
    )
}

export default TopNavCompo;


const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})