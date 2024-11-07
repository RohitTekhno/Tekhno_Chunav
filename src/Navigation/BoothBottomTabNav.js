import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TownBooths from '../TownUser/Booths/TownBooths';
import TownVoters from '../TownUser/Voters/TownVoters';
import Octicons from '@expo/vector-icons/Octicons';
import LogOut from '../ReusableCompo/LogOut';
import BuserProfile from '../BoothUser/Profile/BuserProfile';
import Prediction from '../BoothUser/Prediction/Prediction';
import CasteList from '../BoothUser/Cast/CasteList';
import BoothDashbord from '../BoothUser/Dashboard/BoothDashbord';
import BoothNVoted from '../BoothUser/Dashboard/BoothNVoted';
import BoothVotedList from '../BoothUser/Dashboard/BoothVotedList';
import BoothVoters from '../TownUser/Booths/BoothVoters';
import Voterlist from '../BoothUser/Dashboard/Voterlist';
import { VoterProvider } from '../ContextApi/VoterContext';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');


const TabBarIcon = ({ focused, name, IconComponent }) => (
    <IconComponent name={name} size={height * 0.033} color={focused ? '#3C4CAC' : 'black'} />
);


const DashboardStack = () => {
    const navigation = useNavigation();
    return (
        <Stack.Navigator initialRouteName=''>
            <Stack.Screen name='Dashboard' component={BoothDashbord}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            <Stack.Screen name="Non Voted" component={BoothNVoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name="Voted" component={BoothVotedList}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />

        </Stack.Navigator>
    )
}

const VotersStack = () => {
    const navigation = useNavigation();

    return (
        <VoterProvider>
            <Stack.Navigator initialRouteName='Voters List'>
                <Stack.Screen name='Voters List' component={Voterlist}
                    options={{
                        headerShown: true, headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontSize: 22
                        },
                        headerShadowVisible: false,
                        headerLeft: () => (
                            <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                                onPress={() => navigation.goBack()}  >
                                <Octicons name="arrow-left" size={30} color="black" />
                            </Pressable>
                        ),
                    }}
                />
            </Stack.Navigator>
        </VoterProvider>
    )
}

const CastStack = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator initialRouteName='CasteList'>
            <Stack.Screen name='Caste-wise Voters' component={CasteList}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

const PredictionStack = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator initialRouteName='Prediction'>
            <Stack.Screen name='Prediction' component={Prediction}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
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
            <Stack.Screen name='Profile' component={BuserProfile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


const BoothBottomTabNav = () => (
    <Tab.Navigator
        initialRouteName='Dashboard'
        activeColor="#3C4CAC"
        barStyle={styles.tabBar}
        shifting={false}
    >
        <Tab.Screen name='Booth Dashboard Tab' component={DashboardStack}
            options={{
                tabBarLabel: "Dashboard",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" IconComponent={AntDesign} />,
            }}
        />

        <Tab.Screen name='Voters Tab' component={VotersStack}
            options={{
                tabBarLabel: 'Voters',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="list-alt" IconComponent={FontAwesome} />,
            }}

        />

        <Tab.Screen name='Cast-Wise Tab' component={CastStack}
            options={{
                tabBarLabel: "Cast-Wise",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="sort" IconComponent={MaterialIcons} />,
            }}
        />

        <Tab.Screen name='Prediction Tab' component={PredictionStack}
            options={{
                tabBarLabel: "Prediction",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="poll" IconComponent={MaterialIcons} />,
            }}
        />


        <Tab.Screen name='Town Profile Tab' component={ProfileStack}
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



export default BoothBottomTabNav;







