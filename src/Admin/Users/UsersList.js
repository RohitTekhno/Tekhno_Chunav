import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout'

const UsersList = () => {
    const navigation = useNavigation();
    return (
        <HeaderFooterLayout showFooter={true}>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between', padding: 50,
            }}>
                <Pressable onPress={() => { navigation.navigate('Towns Users') }} style={{
                    backgroundColor: 'white', alignSelf: 'center',
                    alignContent: 'center', alignItems: 'center',
                    padding: 20, borderRadius: 10, elevation: 10
                }}>
                    <Text>Town User</Text>
                </Pressable>

                <Pressable onPress={() => { navigation.navigate('Booth Users') }} style={{
                    backgroundColor: 'white', alignSelf: 'center',
                    alignContent: 'center', alignItems: 'center',
                    padding: 20, borderRadius: 10, elevation: 10
                }}>
                    <Text>Booth User</Text>
                </Pressable>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Pressable onPress={() => { navigation.navigate('Registration') }} style={{
                    backgroundColor: 'white', alignSelf: 'center',
                    alignContent: 'center', alignItems: 'center',
                    padding: 20, borderRadius: 10, elevation: 10
                }}>
                    <Text>Register User</Text>
                </Pressable>
            </View>
        </HeaderFooterLayout>
    )
}

export default UsersList