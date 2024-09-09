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


const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator
            initialRouteName="ProfileChooser"
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* <Stack.Screen name="BottomTabsNav" component={BottomTabsNav} /> */}
            <Stack.Screen name="Launch Screen" component={LaunchScreen} />
            <Stack.Screen name="ProfileChooser" component={ProfileChooser} />
            <Stack.Screen name="LogInScreen" component={LogInScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 20 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                    headerRight: () => (<ProfileButton />)
                }}
            />
            <Stack.Screen name='Users List' component={UsersList} options={{
                headerShown: true, headerTitleAlign: 'center',
                headerLeft: () => (
                    <MaterialIcons name="menu" size={24} color="black"
                        style={{ marginLeft: 20 }}
                        onPress={() => navigation.toggleDrawer()} />
                ),
            }} />
            <Stack.Screen name='Towns Users' component={TownUsers} options={{
                headerShown: true, headerTitleAlign: 'center',
                headerLeft: () => (
                    <MaterialIcons name="menu" size={24} color="black"
                        style={{ marginLeft: 20 }}
                        onPress={() => navigation.toggleDrawer()} />
                ),
            }} />
            <Stack.Screen name='Booth Users' component={BoothUsers} options={{
                headerShown: true, headerTitleAlign: 'center',
                headerLeft: () => (
                    <MaterialIcons name="menu" size={24} color="black"
                        style={{ marginLeft: 20 }}
                        onPress={() => navigation.toggleDrawer()} />
                ),
            }} />
            <Stack.Screen name='Towns' component={Towns} />
            <Stack.Screen
                name='Town Voters'
                component={TownVoters}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitle: route.params.townId ? `Voters in Town : ${route.params.townId}  ` : 'Town Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 20 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />

            <Stack.Screen name='Booths' component={Booths} />
            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitle: route.params.boothId ? `Voters in Booth : ${route.params.boothId}  ` : 'Booth Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 20 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />

            <Stack.Screen name='Updated Voters' component={BoothUser_ActivityLog}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 20 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            <Stack.Screen name='Registration' component={TownUserReg} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default StackNavigation;
