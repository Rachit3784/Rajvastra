import { View, Text } from 'react-native'
import React  from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';

import SplashScreen from '../screens/Splash/SplashScreen';
import ScreensNavigation from './ScreensNavigation';


const Stack = createNativeStackNavigator();

const RootNavigator = () => {

   

  return (
<Stack.Navigator>
   <Stack.Screen name='Splash' component={SplashScreen} options={{headerShown : false}}/>
    <Stack.Screen name='Main' component={MainNavigation} options={{headerShown : false}}/> 
    <Stack.Screen name='Auth' component={AuthNavigation} options={{headerShown : false}}/>
   <Stack.Screen name='Screens' component={ScreensNavigation}  options={{headerShown : false}}/>
</Stack.Navigator>
  )
}


export default RootNavigator