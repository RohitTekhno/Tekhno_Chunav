import LogOut from '../ReusableCompo/LogOut';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Dimensions, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import Dashboard from '../BoothUser/Dashboard.js'

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('screen')

const BoothUserMainStack = () => {

    const navigation = useNavigation();

    return (

        <Stack.Navigator initialRouteName='Dashboard'>
            <Stack.Screen name='Dashboard' component={Dashboard}
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
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />

        </Stack.Navigator>
    )
}

export default BoothUserMainStack