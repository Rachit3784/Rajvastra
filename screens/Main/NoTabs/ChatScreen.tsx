// // ChatScreen.js
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Keyboard,
//   Platform,
//   StatusBar,
//   SafeAreaView,
// } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   interpolate,
//   Extrapolate,
// } from 'react-native-reanimated';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { ArrowLeft, Phone, Video, Send } from 'lucide-react-native';

// export default function ChatScreen({ navigation }) {

//     const inset = useSafeAreaInsets()
//   const [messages, setMessages] = useState([
//     { id: '1', text: 'Hey there!', isSent: false },
//     { id: '2', text: "I'm good, thanks! Working on something cool", isSent: true },
//     { id: '3', text: 'Nice! Tell me more', isSent: false },
//   ]);
//   const [inputText, setInputText] = useState('');
//   const insets = useSafeAreaInsets();

//   const keyboardHeight = useSharedValue(0);

//   useEffect(() => {
//     const showListener = Keyboard.addListener('keyboardDidShow', (e) => {
//       keyboardHeight.value = withTiming(1, { duration: 300 });
//     });
//     const hideListener = Keyboard.addListener('keyboardDidHide', () => {
//       keyboardHeight.value = withTiming(0, { duration: 300 });
//     });

//     return () => {
//       showListener.remove();
//       hideListener.remove();
//     };
//   }, []);

//   const animatedInputStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateY: interpolate(
//             keyboardHeight.value,
//             [0, 1],
//             [0, -5],
//             Extrapolate.CLAMP
//           ),
//         },
//       ],
//     };
//   });


//   const flatListRef = useRef(null);

// // Add this useEffect to scroll when messages change
// useEffect(() => {
//   if (messages.length > 0) {
//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 100); // Small delay ensures layout is ready
//   }
// }, [messages]);


//   const sendMessage = () => {
//     if (inputText.trim()) {
//       const newMsg = {
//         id: Date.now().toString(),
//         text: inputText.trim(),
//         isSent: true,
//       };
//       setMessages((prev) => [...prev, newMsg]);
//       setInputText('');
//     }
//   };

//   const renderMessage = ({ item }) => (
//     <View
//       style={{
//         marginVertical: 6,
//         marginHorizontal: 16,
//         alignSelf: item.isSent ? 'flex-end' : 'flex-start',
//         maxWidth: '75%',
//       }}
//     >
//       <View
//         style={{
//           backgroundColor: item.isSent ? '#000' : '#333',
//           paddingHorizontal: 16,
//           paddingVertical: 12,
//           borderRadius: 20,
//           borderBottomRightRadius: item.isSent ? 4 : 20,
//           borderBottomLeftRadius: item.isSent ? 20 : 4,
//         }}
//       >
//         <Text style={{ color: '#fff', fontSize: 16, lineHeight: 22 }}>
//           {item.text}
//         </Text>
//       </View>
//     </View>
//   );

//   return (
    
     


//     <View style = {{flex : 1 , backgroundColor : '#fff'}}>
        
//           <View
//         style={{
//             padding :  inset.top,
//           height: 60 +  inset.top,
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           paddingHorizontal: 12,
//          elevation : 3,
//          backgroundColor : "#ffffffff"
//         }}
//       >
//         <View style={{  flex : 1,  paddingTop : inset.top,   height: 60 +  inset.top , flexDirection: 'row', alignItems: 'center' }}>
//           <TouchableOpacity onPress={() => navigation?.goBack()}>
//             <ArrowLeft color="#000000ff" size={28} />
//           </TouchableOpacity>

//           <View style={{ width: 44, height: 44, marginLeft: 12 }}>
//             <Image
//               source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
//               style={{ width: 44, height: 44, borderRadius: 22 }}
//             />
//           </View>

//           <View style={{ marginLeft: 12 }}>
//             <Text style={{ color: '#000000ff', fontSize: 18, fontWeight: '600' }}>
//               Sophia Miller
//             </Text>
//             <Text style={{ color: '#888', fontSize: 13 }}>Online</Text>
//           </View>
//         </View>

//         {/* <View style={{ flexDirection: 'row', gap: 20 }}>
//           <TouchableOpacity>
//             <Phone color="#fff" size={24} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Video color="#fff" size={28} />
//           </TouchableOpacity>
//         </View> */}


//       </View>

//       {/* Messages */}
//       <FlatList
//       ref={flatListRef}
//         data={messages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         style={{ flex: 1 }}
       
//         maintainVisibleContentPosition={{
//     minIndexForVisible: 1,
//     autoscrollToTopThreshold: 10,
//   }}

//         contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
//       />

//       {/* Input Bar - Animated */}
//       <Animated.View
//         style={[
//           {
//             backgroundColor: '#ffffffff',
//             elevation : 3,
           
//             paddingBottom: insets.bottom || 12,
//           },
//           animatedInputStyle,
//         ]}
//       >
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             paddingHorizontal: 16,
//             paddingTop: 12,
//           }}
//         >
//          <TextInput
//   style={{
//     flex: 1,
//     backgroundColor: '#cccccc38',
//     color: '#000000ff',
//     paddingHorizontal: 18,
//     paddingVertical: 14,
//     borderRadius: 25,
//     fontSize: 16,
//     maxHeight: 90,          
//     textAlignVertical: 'top' 
//   }}
//   placeholder="Type a message..."
//   placeholderTextColor="#353535ff"
//   value={inputText}
//   onChangeText={setInputText}
//   multiline
//   scrollEnabled={true}     
// />


//           <TouchableOpacity
//             onPress={sendMessage}
//             style={{
//               marginLeft: 12,
//               backgroundColor: '#afafaf29',
//               width: 48,
//               height: 48,
//               borderRadius: 24,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Send color="#000" size={22} />
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
  
//     </View>
//   );
// }



// ChatScreen.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';
import { MyContext } from '../../../store/MyContext'; // Adjust path if needed
import userStore from '../../../store/MyStore';
import { useRoute } from '@react-navigation/native';

export default function ChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { socket, registered } = useContext(MyContext);
  const route = useRoute();

  const {friendId} = route.params
  
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey there!', isSent: false },
    { id: '2', text: "I'm good, thanks! Working on something cool", isSent: true },
    { id: '3', text: 'Nice! Tell me more', isSent: false },
  ]);
  const [inputText, setInputText] = useState('');

  const flatListRef = useRef(null);
  const keyboardHeight = useSharedValue(0);
 const {userModelID} = userStore()
  // Keyboard animation
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      keyboardHeight.value = withTiming(1, { duration: 300 });
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      keyboardHeight.value = withTiming(0, { duration: 300 });
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(keyboardHeight.value, [0, 1], [0, -5], Extrapolate.CLAMP),
      },
    ],
  }));

  // Auto scroll to bottom when new message
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Listen for incoming messages from socket
  useEffect(() => {
    if (!socket || !registered) return;

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          isSent: false, // received
        },
      ]);
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket, registered]);

  // Send message
  const sendMessage = () => {
    if (!inputText.trim() || !socket || !registered) return;

    const messageText = inputText.trim();

    // Send via socket
    socket.emit('send-message', {
      from: userModelID,
      to: friendId,
      message: messageText,
    });
  
    // Add to UI instantly (optimistic update)
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: messageText,
        isSent: true,
      },
    ]);

    setInputText('');
  };

  const renderMessage = ({ item }) => (
    <View
      style={{
        marginVertical: 6,
        marginHorizontal: 16,
        alignSelf: item.isSent ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
      }}
    >
      <View
        style={{
          backgroundColor: item.isSent ? '#000' : '#e5e5ea',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 20,
          borderBottomRightRadius: item.isSent ? 4 : 20,
          borderBottomLeftRadius: item.isSent ? 20 : 4,
        }}
      >
        <Text style={{ color: item.isSent ? '#fff' : '#000', fontSize: 16, lineHeight: 22 }}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  // Show loading if not connected
  if (!registered) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Connecting to chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff'}}>
      

      {/* Header */}
      <View
        style={{
            paddingTop : insets.top,
          height: 60 + insets.top,
         elevation : 3,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#ffffffff',
          
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingLeft: 8 }}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: 8 }}>
            <ArrowLeft color="#000" size={28} />
          </TouchableOpacity>

          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={{ width: 44, height: 44, borderRadius: 22, marginLeft: 8 }}
          />

          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>Sophia Miller</Text>
            <Text style={{ fontSize: 13, color: '#00a800' }}>Online</Text>
          </View>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 1,
          autoscrollToTopThreshold: 10,
        }}
      />

      {/* Input Bar */}
      <Animated.View
        style={[
          {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            paddingBottom: insets.bottom + 10,
          },
          animatedInputStyle,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingTop: 10 }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#f0f0f0',
              color: '#000',
              paddingHorizontal: 18,
              paddingVertical: 14,
              borderRadius: 25,
              fontSize: 16,
              maxHeight: 100,
              textAlignVertical: 'center',
            }}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={{
              marginLeft: 10,
              backgroundColor: '#007AFF',
              width: 48,
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={!inputText.trim()}
          >
            <Send color="#fff" size={22} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}