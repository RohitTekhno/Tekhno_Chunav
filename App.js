import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { BoothUser_Provider } from './src/Context_Api/BoothUser_Context';
import DrawerNavigationComp from './src/Navigation/DrawerNavigationComp';
import StackNavigation from './src/Navigation/StackNavigation';
import BottomTabsNav from './src/Navigation/BottomTabsNav';

export default function App() {
  return (
    <>
      <StatusBar style="light" translucent={true} />
      <BoothUser_Provider>
        <NavigationContainer>
          <DrawerNavigationComp >
            <StackNavigation>
              <BottomTabsNav />
            </StackNavigation>
          </DrawerNavigationComp>
        </NavigationContainer>
      </BoothUser_Provider>
    </>
  );
}
