import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { AuthenticationContext } from '../Admin/Context_Api/AuthenticationContext';
import { TownUserContext } from '../TownUser/ContextApi/TownUserProvider';
import AdminMainStack from '../Navigation/AdminMainStack';
import TownUserMainStack from './TownUserMainStack';
import LaunchScreen from '../ReusableCompo/LaunchScreen';
import ProfileChooser from '../ReusableCompo/ProfileChooser';
import TownUserLogin from '../ReusableCompo/Logins/TownUserLogin';
import BoothUserLogin from '../ReusableCompo/Logins/BoothUserLogin';
import AdminLogin from '../ReusableCompo/Logins/AdminLogin';
import { BoothUserContext } from '../BoothUser/ContextApi/BuserContext';
import BoothUserMainStack from './BoothUserMainStack';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    const { isAuthenticated } = useContext(AuthenticationContext);
    const { isTuserAuthenticated } = useContext(TownUserContext);
    const { isBuserAuthenticated } = useContext(BoothUserContext)
    return (
        <Stack.Navigator
            initialRouteName={"Launch Screen"}
            screenOptions={{
                headerShown: false,
            }}
        >
            {isAuthenticated ? (
                <Stack.Screen name="Admin" component={AdminMainStack} />
            ) : isTuserAuthenticated ? (
                <Stack.Screen name="TownUser" component={TownUserMainStack} />
            ) : isBuserAuthenticated ? (
                <Stack.Screen name="BoothUser" component={BoothUserMainStack} />
            ) : (

                <>
                    <Stack.Screen name="Launch Screen" component={LaunchScreen} />
                    <Stack.Screen name="ProfileChooser" component={ProfileChooser} />
                    <Stack.Screen name="AdminLogin" component={AdminLogin} />
                    <Stack.Screen name="TownUserLogin" component={TownUserLogin} />
                    <Stack.Screen name="BoothUserLogin" component={BoothUserLogin} />
                </>
            )
            }
        </Stack.Navigator >
    );
};

export default StackNavigation;
