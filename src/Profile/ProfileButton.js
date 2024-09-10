import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileButton = () => {
    const navigation = useNavigation();

    return (
        <Pressable onPress={() => navigation.navigate('Profile')}
            style={{
                width: 40,
                height: 40,
                borderRadius: 25,
                borderWidth: 3,
                borderColor: "#3C4CAC",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginRight: 10
            }}>
            <Image source={require('../Assets/Cover.png')}
                style={{
                    width: 37,
                    height: 37
                }} />
        </Pressable>
    );
}

export default ProfileButton;
