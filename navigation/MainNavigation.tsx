
import React from 'react'

import HomeScreen from '../screens/Main/Tabs/HomeScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Profile from '../screens/Main/Tabs/Profile'
import Chat from '../screens/Main/Tabs/Chat'
import Order from '../screens/Main/Tabs/Order'
import Social from '../screens/Main/Tabs/Social'
import CustomTabBar from '../components/CustomTabs'
import ChatScreen from '../screens/Main/Tabs/Chat'


const Tabs = createBottomTabNavigator()

const MainNavigation = () => {
  return (
     <Tabs.Navigator 
     tabBar={(props) => <CustomTabBar {...props} />} 
      screenOptions={{ headerShown: false }}

     >
    <Tabs.Screen name='Home'  component = {HomeScreen} options={{headerShown : false}}/>
     <Tabs.Screen name='Social'  component = {Social} options={{headerShown : false}}/>
       <Tabs.Screen name='Order'  component = {Order} options={{headerShown : false}}/>
     <Tabs.Screen name='Profile'  component = {Profile} options={{headerShown : false}}/>
        <Tabs.Screen name='Chats'  component = {ChatScreen} options={{headerShown : false}}/>
   </Tabs.Navigator>
  )
}

export default MainNavigation