import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { BoothUser_Provider } from './Admin/Context_Api/BoothUser_Context';
import DrawerNavigationComp from './Admin/Navigation/DrawerNavigationComp';
import StackNavigation from './Admin/Navigation/StackNavigation';
import BottomTabsNav from './Admin/Navigation/BottomTabsNav';
import { AuthenticationProvider } from './Admin/Context_Api/AuthenticationContext';

export default function AdminMain() {
  return (
    <>
      <StatusBar style="light" translucent={true} />
      <AuthenticationProvider>
        <BoothUser_Provider>
          {/* <NavigationContainer> */}
          <DrawerNavigationComp >
            <StackNavigation />
          </DrawerNavigationComp>
          {/* </NavigationContainer> */}
        </BoothUser_Provider>
      </AuthenticationProvider>
    </>
  );
}
