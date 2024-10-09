import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Dashboard from '../Admin/Dashboard/Dashboard';
import ProfileButton from '../Admin/Profile/ProfileButton';
import Towns from '../Admin/Towns/Towns';
import Booths from '../Admin/Booth/Booths';
import Profile from '../Admin/Profile/Profile';

const Tab = createBottomTabNavigator();

const AdminBottomTabsNav = () => {
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            initialRouteName='Dashboard'
            screenOptions={{
                tabBarActiveTintColor: 'black',
                headerShown: false,
                headerTitleAlign: 'center',
            }}>

            <Tab.Screen name='Dashboard' component={Dashboard}
                options={{
                    headerShown: true,
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={24} color="black" />
                    ),
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={24} color="black"
                            style={{ marginLeft: 20 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                    headerRight: () => <ProfileButton />
                }}
            />

            <Tab.Screen name='Towns' component={Towns}
                options={{
                    tabBarLabel: 'Towns',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="city-variant-outline" size={24} color="black" />
                    ),
                }}
            />
            <Tab.Screen name='Booth' component={Booths}
                options={{
                    tabBarLabel: 'Booths',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="person-booth" size={18} color="black" style={{ padding: 2 }} />
                    ),
                }}
            />
            <Tab.Screen name='Profile' component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={24} color="black" />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default AdminBottomTabsNav;
