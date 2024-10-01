import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabsNav from '../Navigation/BottomTabsNav';
import LaunchScreen from '../ReusableCompo/LaunchScreen';
import ProfileChooser from '../ReusableCompo/ProfileChooser';
import LogInScreen from '../ReusableCompo/LogInScreen';
import Towns from '../Towns/Towns';
import TownUsers from '../Towns/TownUsers';
import TownVoters from '../Towns/TownVoters';
import BoothVoters from '../Booth/BoothVoters';
import BoothUsers from '../Booth/BoothUser';
import BoothUser_ActivityLog from '../Booth/BoothUser_ActivityLog';
import TownUserReg from '../Registeration/TownUserReg';
import Profile from '../Profile/Profile';
import LogOut from '../Profile/LogOut';
import Booths from '../Booth/Booths';
import UsersList from '../Users/UsersList';
import Dashboard from '../Dashboard/Dashboard';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ProfileButton from '../Profile/ProfileButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../Context_Api/AuthenticationContext';
import AgewiseVoters from '../Filter/AgewiseVoters';
import LoadingAuth from '../ReusableCompo/LoadingAuth';
import Totalvoters from '../Voters/TotalVoters';
import VotingBarStats from '../Dashboard/VotingBarStats';
import ContactUs from '../ContactUs/ContactUs';
import TBVotersPDF from '../Voters/TBVotersPdf';
import Voted from '../Voters/Voted';
import Nvoted from '../Voters/Nvoted';
import DropdownSelector from '../Voters/DropdownSelector';
import VoterListSection from '../Voters/VoterListSection';
import ReligionCasteList from '../Filter/ReligionCasteList';


const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    const { isAuthenticated } = useContext(AuthenticationContext)
    const navigation = useNavigation();

    const handleGoBack = () => {
        if (onLeftIconPress) {
            onLeftIconPress();
        } else {
            navigation.goBack();
        }
    };
    return (
        <Stack.Navigator
            initialRouteName={"LogInScreen"}
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* <Stack.Screen name='loading Auth' component={LoadingAuth} /> */}
            {/* {isAuthenticated ? ( */}
                <>
                    <Stack.Screen name="Dashboard" component={Dashboard}
                        options={{
                            headerShown: true, headerTitleAlign: 'center',
                            headerLeft: () => (
                                <MaterialIcons name="menu" size={24} color="black"
                                    style={{ marginLeft: 10 }}
                                    onPress={() => navigation.toggleDrawer()} />
                            ),
                            headerRight: () => (<ProfileButton />)
                        }}
                    />
                    <Stack.Screen name='Users List' component={UsersList} 
                    options={{
                        headerShown: true, headerTitleAlign: 'center',
                        headerLeft: () => (
                            <MaterialIcons name="menu" size={24} color="black"
                                style={{ marginLeft: 10 }}
                                onPress={() => navigation.toggleDrawer()} />
                        ),
                    }}
                     />
                    <Stack.Screen name='ContactUs' component={ContactUs} options={{
                    }} />


                    <Stack.Screen name='Voters' component={TBVotersPDF} options={{
                    }} />


                    <Stack.Screen name='Voted' component={Voted} options={{
                    }} />


                    <Stack.Screen name='Nvoted' component={Nvoted} options={{
                    }} />


                    <Stack.Screen name='DropdownSelector' component={DropdownSelector} options={{
                    }} />


                    <Stack.Screen name='VoterListSection' component={VoterListSection} options={{
                    }} />


                    <Stack.Screen name='Registration' component={TownUserReg} options={{
                    }} />

                    <Stack.Screen name='Castwise' component={ReligionCasteList} options={{
                    }} />


                    <Stack.Screen name='VotingBarStats' component={VotingBarStats} options={{
                        headerShown: true, headerTitleAlign: 'center',
                        headerLeft: () => (
                            <MaterialIcons name="menu" size={24} color="black"
                                style={{ marginLeft: 10 }}
                                onPress={() => navigation.toggleDrawer()} />
                        ),
                    }} />
                    <Stack.Screen name='Towns Users' component={TownUsers} options={{
                       
                    }} />
                    <Stack.Screen name='Booth Users' component={BoothUsers} 
                    // options={{
                    //     headerShown: true, headerTitleAlign: 'center',
                    //     headerLeft: () => (
                    //         <MaterialIcons name="menu" size={24} color="black"
                    //             style={{ marginLeft: 10 }}
                    //             onPress={() => navigation.toggleDrawer()} />
                    //     ),
                    // }} 
                    />
                    <Stack.Screen name='Towns' component={Towns} />
                    <Stack.Screen name='Town Voters' component={TownVoters}
                        // options={({ route }) => ({
                        //     headerShown: true,
                        //     headerTitleAlign: 'center',
                        //     headerTitle: route.params.townId ? `Voters in Town : ${route.params.townId}  ` : 'Town Voters',
                        //     headerLeft: () => (
                        //         <MaterialIcons name="menu" size={24} color="black"
                        //             style={{ marginLeft: 10 }}
                        //             onPress={() => navigation.toggleDrawer()} />
                        //     ),
                        // })}
                    />

                    <Stack.Screen name='Booths' component={Booths} />
                    <Stack.Screen name='Booth Voters' component={BoothVoters}
                        // options={({ route }) => ({
                        //     headerShown: true,
                        //     headerTitleAlign: 'center',
                        //     headerTitle: route.params.boothId ? `Voters in Booth : ${route.params.boothId}  ` : 'Booth Voters',
                        //     headerLeft: () => (
                        //         <MaterialIcons name="arrow-back-ios" size={24} color="black"
                        //             style={{ marginLeft: 10 }}
                        //             onPress={() => navigation.toggleDrawer()} />
                        //     ),
                        // })}
                    />

                    <Stack.Screen name='Updated Voters' component={BoothUser_ActivityLog}
                        // options={{
                        //     headerShown: true, headerTitleAlign: 'center',
                        //     headerLeft: () => (
                        //         <MaterialIcons name="menu" size={24} color="black"
                        //             style={{ marginLeft: 10 }}
                        //             onPress={() => navigation.toggleDrawer()} />
                        //     ),
                        // }}
                    />
                    <Stack.Screen name='Age Wise Voters' component={AgewiseVoters}
                        // options={{
                        //     headerShown: true, headerTitleAlign: 'center',
                        //     headerLeft: () => (
                        //         <MaterialIcons name="menu" size={24} color="black"
                        //             style={{ marginLeft: 10 }}
                        //             onPress={() => navigation.toggleDrawer()} />
                        //     ),
                        // }}
                    />

                    <Stack.Screen name='Total Voters' component={Totalvoters}
                        // options={{
                        //     headerShown: true, headerTitleAlign: 'center',
                        //     headerLeft: () => (
                        //         <MaterialIcons name="menu" size={24} color="black"
                        //             style={{ marginLeft: 10 }}
                        //             onPress={() => navigation.toggleDrawer()} />
                        //     ),
                        // }}
                    />
                    
                    <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
                    <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
                {/* </> */}
                {/* ) : ( */}
                {/* <> */}
                    {/* <Stack.Screen name="Launch Screen" component={LaunchScreen} />
                    <Stack.Screen name="ProfileChooser" component={ProfileChooser} /> */}
                    <Stack.Screen name="LogInScreen" component={LogInScreen} />
                </>
                {/* // )} */}
        </Stack.Navigator >
    );
};

export default StackNavigation;
