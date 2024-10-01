import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';

import CustomDrawerContent from './CustomDrawerContent';
import ProfileButton from '../Profile/ProfileButton';
import AboutUs from '../AboutUs/AboutUs';
import ContactUs from '../ContactUs/ContactUs';
import Help from '../Help/Help';
import Setting from '../Setting/Setting';
import Prediction from '../Predication/Prediction';
import StackNavigation from './StackNavigation';  // Nest the StackNavigation for specific screens.

const DrawerNavigationComp = () => {
    const Drawer = createDrawerNavigator();
    const drawerWidth = Dimensions.get('window').width * 0.6;

    return (
        <>
            <StatusBar style="auto" />
            <Drawer.Navigator
                initialRouteName='Home'
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={({ navigation }) => ({
                    drawerStyle: {
                        width: drawerWidth,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20
                    },
                    headerRight: () => <ProfileButton />,
                    headerRightContainerStyle: {
                        paddingRight: 20,
                    },
                    headerShown: false,
                    headerTitleAlign: 'center',

                })}
            >
                <Drawer.Screen name='Home' component={StackNavigation} />
                <Drawer.Screen name='Prediction' component={Prediction} />
                <Drawer.Screen name='About Us' component={AboutUs} />
                <Drawer.Screen name='Contact Us' component={ContactUs} />
                <Drawer.Screen name='Help' component={Help} />
                <Drawer.Screen name='Setting' component={Setting} />
            </Drawer.Navigator>
        </>
    );
}

export default DrawerNavigationComp;
