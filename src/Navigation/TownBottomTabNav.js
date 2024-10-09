import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TownBooths from '../TownUser/TownBooths';
import TownProfile from '../TownUser/TownProfile';
import Townvoterlist from '../TownUser/Townvoterlist';
import TboothUsers from '../TownUser/TboothUsers';
import Octicons from '@expo/vector-icons/Octicons';
import ApprovalScreen from '../TownUser/ApprovalScreen';
import BoothVoters from '../TownUser/BoothVoters';
import TownUserMainStack from './TownUserMainStack';
import LogOut from '../ReusableCompo/LogOut';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');


const TabBarIcon = ({ focused, name, IconComponent }) => (
    <IconComponent name={name} size={height * 0.033} color={focused ? '#3C4CAC' : 'black'} />
);


const VotersStack = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator initialRouteName=''>
            <Stack.Screen name='Voters List' component={Townvoterlist}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

const BoothsStack = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator initialRouteName='Town Booths'>
            <Stack.Screen name='Booths' component={TownBooths}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

const UsersStack = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator initialRouteName='Dashboard'>
            <Stack.Screen name='Booth Users' component={TboothUsers}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='Approval Voters' component={ApprovalScreen}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

const ProfileStack = () => {
    return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name='Profile' component={TownProfile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


const TownBottomTabNav = () => (
    <Tab.Navigator
        initialRouteName='Dashboard'
        activeColor="#3C4CAC"
        barStyle={styles.tabBar}
        shifting={false}
    >
        <Tab.Screen name='Town Dashboard' component={TownUserMainStack}
            options={{
                tabBarLabel: "Dashboard",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" IconComponent={AntDesign} />,
            }}
        />

        <Tab.Screen name='Town Voters List' component={VotersStack}
            options={{
                tabBarLabel: 'Voters',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="list-alt" IconComponent={FontAwesome} />,
            }}

        />

        <Tab.Screen name='Town Booths' component={BoothsStack}
            options={{
                tabBarLabel: "Booths",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="person-booth" IconComponent={FontAwesome5} />,
            }}
        />

        <Tab.Screen name='Town Booth Users' component={UsersStack}
            options={{
                tabBarLabel: "Users",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="users" IconComponent={FontAwesome6} />,
            }}
        />

        <Tab.Screen name='Town Profile' component={ProfileStack}
            options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="person" IconComponent={MaterialIcons} />,
            }}
        />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
        height: height * 0.1,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    tabItem: {
        alignItems: 'center',
        marginTop: 8
    },
    activeTab: {
        width: 55,
        height: 55,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        borderRadius: 100,
        marginBottom: 30,
        alignItems: 'center'
    },
});



export default TownBottomTabNav;







// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import { useNavigation } from '@react-navigation/native';
// import Towndash from '../TownUser/Dashboard/TuserDashboard';
// import TownBooths from '../TownUser/TownBooths';
// import TownProfile from '../TownUser/TownProfile';
// import ProfileButton from '../Admin/Profile/ProfileButton';
// import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
// import Townvoterlist from '../TownUser/Townvoterlist';
// import BoothUsers from '../Admin/Booth/BoothUser';
// import TboothUsers from '../TownUser/TboothUsers';
// import Octicons from '@expo/vector-icons/Octicons';
// import ApprovalScreen from '../TownUser/ApprovalScreen';
// import BoothVoters from '../TownUser/BoothVoters';
// import { useState } from 'react';


// const Tab = createBottomTabNavigator();
// const { height, width } = Dimensions.get('window');

// const TownBottomTabNav = () => {
//     const navigation = useNavigation();

//     return (
//         <Tab.Navigator
//             initialRouteName='Dashboard'
//             screenOptions={{
//                 tabBarActiveTintColor: 'black',
//                 headerTitleAlign: 'center',
//                 tabBarStyle: {
//                     height: height * 0.08,
//                     paddingBottom: 3,
//                     alignItems: 'center',
//                 },
//             }}>

//             <Tab.Screen name='Dashboard' component={Towndash}
//                 options={{
//                     headerShown: true,
//                     tabBarLabel: 'Dashboard',
//                     tabBarLabel: ({ focused }) => (
//                         <Text style={{
//                             color: focused ? '#3C4CAC' : 'black',
//                             fontSize: width * 0.034,
//                             fontWeight: focused ? '500' : 'normal',
//                         }}>Dashboard</Text>
//                     ),
//                     tabBarIcon: ({ focused }) => (
//                         <AntDesign name="home" size={height * 0.038} color={focused ? '#3C4CAC' : 'black'}
//                             style={{ paddingTop: 8, alignItems: 'center' }} />
//                     ),
//                     headerLeft: () => (
//                         <MaterialIcons name="menu" size={24} color="black"
//                             style={{ marginLeft: 20 }}
//                             onPress={() => navigation.toggleDrawer()} />
//                     ),
//                     headerRight: () => <ProfileButton />
//                 }}
//             />

//             <Tab.Screen name='Voters List' component={Townvoterlist}
//                 options={{
//                     tabBarLabel: ({ focused }) => (
//                         <Text style={{
//                             color: focused ? '#3C4CAC' : 'black',
//                             fontSize: width * 0.034,
//                             fontWeight: focused ? '500' : 'normal',
//                         }}>Voters</Text>
//                     ),
//                     tabBarIcon: ({ focused }) => (
//                         <FontAwesome name="list-alt" size={height * 0.035} color={focused ? '#3C4CAC' : 'black'} style={{ paddingTop: 8, alignItems: 'center' }} />
//                     ),
//                     headerLeft: () => (
//                         <Pressable style={{ marginLeft: 10, width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
//                             onPress={() => navigation.goBack()}  >
//                             <Octicons name="chevron-left" size={30} color="black" />
//                         </Pressable>
//                     ),
//                 }}
//             />
//             <Tab.Screen name='Booths' component={TownBooths}
//                 options={{
//                     tabBarLabel: ({ focused }) => (
//                         <Text style={{
//                             color: focused ? '#3C4CAC' : 'black',
//                             fontSize: width * 0.034,
//                             fontWeight: focused ? '500' : 'normal',
//                         }}>Booths</Text>
//                     ),
//                     tabBarIcon: ({ focused }) => (
//                         <FontAwesome5 name="person-booth" size={height * 0.03} color={focused ? '#3C4CAC' : 'black'} style={{ paddingTop: 5 }} />
//                     ),
//                     headerLeft: () => (
//                         <Pressable style={{ marginLeft: 10, width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
//                             onPress={() => navigation.goBack()}  >
//                             <Octicons name="chevron-left" size={30} color="black" />
//                         </Pressable>
//                     ),
//                 }}
//             />
//             <Tab.Screen name='Booth Voters' component={BoothVoters}
//                 options={{
//                     headerShown: true, headerTitleAlign: 'center',
//                     headerShadowVisible: false,
//                     headerLeft: () => (
//                         <Pressable style={{ marginLeft: 10, width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
//                             onPress={() => navigation.goBack()}  >
//                             <Octicons name="chevron-left" size={30} color="black" />
//                         </Pressable>
//                     ),
//                     tabBarButton: () => null
//                 }}
//             />

//             <Tab.Screen name='Booth Users' component={TboothUsers}
//                 options={{
//                     tabBarLabel: ({ focused }) => (
//                         <Text style={{
//                             color: focused ? '#3C4CAC' : 'black',
//                             fontSize: width * 0.034,
//                             fontWeight: focused ? '500' : 'normal',
//                         }}>Users</Text>
//                     ),
//                     tabBarIcon: ({ focused }) => (
//                         <FontAwesome6 name="users" size={height * 0.03} color={focused ? '#3C4CAC' : 'black'} style={{ paddingTop: 5 }} />
//                     ),
//                     headerLeft: () => (
//                         <Pressable style={{ marginLeft: 10, width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
//                             onPress={() => navigation.goBack()}  >
//                             <Octicons name="chevron-left" size={30} color="black" />
//                         </Pressable>
//                     ),
//                 }}
//             />
//             <Tab.Screen name='Approval Voters' component={ApprovalScreen}
//                 options={{
//                     headerShown: true, headerTitleAlign: 'center',
//                     headerLeft: () => (
//                         <Pressable style={{ marginLeft: 10, width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
//                             onPress={() => navigation.goBack()}  >
//                             <Octicons name="chevron-left" size={30} color="black" />
//                         </Pressable>
//                     ),
//                     tabBarButton: () => null
//                 }}
//             />

//             <Tab.Screen name='Profile' component={TownProfile}
//                 options={{
//                     headerShown: false,
//                     tabBarLabel: ({ focused }) => (
//                         <Text style={{
//                             color: focused ? '#3C4CAC' : 'black',
//                             fontSize: width * 0.034,
//                             fontWeight: focused ? '500' : 'normal',
//                         }}>Profile</Text>
//                     ),
//                     tabBarIcon: ({ focused }) => (
//                         <MaterialIcons name="person" size={height * 0.04} color={focused ? '#3C4CAC' : 'black'} style={{ paddingTop: 5 }} />
//                     ),
//                 }}
//             />
//         </Tab.Navigator>
//     )
// }

// const styles = StyleSheet.create({
//     tabItem: {
//         alignItems: 'center',
//         marginTop: 8
//     },
//     activeTab: {
//         width: 55,
//         height: 55,
//         paddingVertical: 10,
//         paddingHorizontal: 10,
//         backgroundColor: 'rgba(173, 216, 230, 0.5)',
//         borderRadius: 100,
//         marginBottom: 30,
//         alignItems: 'center'
//     },
// });


// export default TownBottomTabNav;
