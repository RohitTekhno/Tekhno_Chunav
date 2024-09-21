import AgewiseVoters from '../Admin/Filter/AgewiseVoters'
import BoothUser_ActivityLog from '../Admin/Booth/BoothUser_ActivityLog'
import BoothUsers from '../Admin/Booth/BoothUser'
import BoothVoters from '../Admin/Booth/BoothVoters'
import Booths from '../Admin/Booth/Booths'
import Dashboard from '../Admin/Dashboard/Dashboard'
import LogOut from '../ReusableCompo/LogOut'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Profile from '../Admin/Profile/Profile'
import React from 'react'
import Totalvoters from '../Admin/Voters/TotalVoters'
import TownUserReg from '../Admin/Registeration/TownUserReg'
import TownUsers from '../Admin/Towns/TownUsers'
import TownVoters from '../Admin/Towns/TownUsers'
import Towns from '../Admin/Towns/Towns'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Pressable } from 'react-native'
import Octicons from '@expo/vector-icons/Octicons';



const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('screen')

const AdminMainStack = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            <Stack.Screen name='Towns Users' component={TownUsers} options={{
                headerShown: true, headerTitleAlign: 'center',
                headerLeft: () => (
                    <MaterialIcons name="menu" size={24} color="black"
                        style={{ marginLeft: 10 }}
                        onPress={() => navigation.toggleDrawer()} />
                ),
            }} />
            <Stack.Screen name='Booth Users' component={BoothUsers} options={{
                headerShown: true, headerTitleAlign: 'center',
                headerLeft: () => (
                    <MaterialIcons name="menu" size={24} color="black"
                        style={{ marginLeft: 10 }}
                        onPress={() => navigation.toggleDrawer()} />
                ),
            }} />
            <Stack.Screen name='Towns' component={Towns}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: height * 0.02,
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={width * 0.05} color="black" />
                        </Pressable>
                    ),
                }} />
            <Stack.Screen name='Town Voters' component={TownVoters}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitle: route.params.townId ? `Voters in Town : ${route.params.townId}  ` : 'Town Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />

            <Stack.Screen name='Booths' component={Booths}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: height * 0.02,
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={width * 0.05} color="black" />
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitle: route.params.boothId ? `Voters in Booth : ${route.params.boothId}  ` : 'Booth Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />

            <Stack.Screen name='Updated Voters' component={BoothUser_ActivityLog}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />
            <Stack.Screen name='Age Wise Voters' component={AgewiseVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            <Stack.Screen name='Total Voters' component={Totalvoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />
            <Stack.Screen name='Registration' component={TownUserReg} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>

    )
}

export default AdminMainStack
