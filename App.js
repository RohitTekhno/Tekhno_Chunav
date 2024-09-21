import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthenticationProvider } from './src/Admin/Context_Api/AuthenticationContext';
import StackNavigation from './src/Navigation/StackNavigation';
import DrawerNavigationComp from './src/Navigation/DrawerNavigationComp'
import { TownUserProvider } from './src/TownUser/ContextApi/TownUserProvider';
import { BoothUserProvider } from './src/BoothUser/ContextApi/BuserContext';

export default function App() {
  return (
    <>
      <StatusBar style="light" translucent={true} />
      <AuthenticationProvider>
        <BoothUserProvider>
          <TownUserProvider>
            <NavigationContainer>
              <DrawerNavigationComp>
                <StackNavigation />
              </DrawerNavigationComp>
            </NavigationContainer>
          </TownUserProvider>
        </BoothUserProvider>
      </AuthenticationProvider>
    </>
  );
}
