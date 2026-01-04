import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignupScreen from '../screens/Auth/SignupScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import InterestsScreen from '../screens/Auth/Interest';


const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator >
      
        <Stack.Screen name='Signup' component={SignupScreen} options={{headerShown : false}}/>
        <Stack.Screen name='login' component={LoginScreen} options={{headerShown : false}} />
           <Stack.Screen name='OTP' component={OtpScreen} options={{headerShown : false}} />
           <Stack.Screen name='Interest' component={InterestsScreen} options={{headerShown : false}} />
           
    </Stack.Navigator>
  )
}

export default AuthNavigation