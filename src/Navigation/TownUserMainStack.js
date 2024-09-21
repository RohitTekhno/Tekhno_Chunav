import BuserRegisteration from '../TownUser/BuserRegisteration'
import LogOut from '../ReusableCompo/LogOut';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Dimensions, Pressable } from 'react-native';
import RightManuBtn from '../TownUser/ExtraComponents/RightManuBtn';
import TboothUsers from '../TownUser/TboothUsers';
import TotalNonVoted from '../TownUser/TotalNonVoted'
import TotalVoted from '../TownUser/TotalVoted'
import TownBooths from '../TownUser/TownBooths';
import TownProfile from '../TownUser/TownProfile';
import Towndash from '../TownUser/Dashboard/TuserDashboard';
import Townvoterlist from '../TownUser/Townvoterlist';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import CastWiseVoters from '../TownUser/CastWiseVoters';
import BoothVoters from '../TownUser/BoothVoters';

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('screen')
const TownUserMainStack = () => {
    const navigation = useNavigation();

    return (

        <Stack.Navigator initialRouteName='Dashboard'>
            <Stack.Screen name='Dashboard' component={Towndash}
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
                    headerRight: () => (<RightManuBtn />)
                }}
            />
            <Stack.Screen name='Town Voters List' component={Townvoterlist}
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
            <Stack.Screen name='Town Booths' component={TownBooths}
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
            <Stack.Screen name='Booth Users' component={TboothUsers}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='Total Voted' component={TotalVoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='Total Non Voted' component={TotalNonVoted}
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


            <Stack.Screen name='Castwise Voters' component={CastWiseVoters}
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
            <Stack.Screen name='Registeration' component={BuserRegisteration} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={TownProfile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />

        </Stack.Navigator>
    )
}

export default TownUserMainStack








