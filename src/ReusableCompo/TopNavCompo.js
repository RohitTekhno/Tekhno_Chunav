import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

const TopNavCompo = ({ navigation, ScreenName, colorName }) => {
    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleNotificationBtn = () => {
        Alert.alert("Notification Pressed...")
    }


    return (
        <View style={styles.nav}>
            <Pressable onPress={handleGoBack}>
                <Icon name='chevron-left' size={25} color={colorName ? colorName : 'black'} />
            </Pressable>

            <Text style={[styles.text, { color: colorName ? colorName : 'black' }]}>{ScreenName}</Text>

            <Pressable onPress={handleNotificationBtn}>
                <AntDesign name="bells" size={24} color={colorName ? colorName : 'black'} />
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