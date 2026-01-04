import { View, Text, FlatList, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import { ArrowLeft, Box, ChevronLeft, ChevronRight, Headset, Heart, LocationEdit, PercentCircle, ShoppingBag } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native';


const {width} = Dimensions.get('screen');




const CollapsableHeader = ({ navigation }) => (
  <View
    style={{
      width,
      height: 88,
      paddingTop: StatusBar.currentHeight || 24,
      paddingHorizontal: 16,
      backgroundColor: '#fde800ff',
      justifyContent: 'center',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
        style={{
          width: 70,
          flexDirection : 'row',
          height: 40,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap : 3
        }}
      >
        <ArrowLeft size={22} color="#111827" />

        <Text
        style={{
          marginLeft: 3,
          fontSize: 18,
          fontWeight: '700',
          color: '#111827',
        }}
      >
        Orders
      </Text>


      </TouchableOpacity>
      
    </View>
  </View>
);



const Order = () => {
  const navigation = useNavigation();


  const handleOption  = (item)=>{
    if(item.name === "Orders"){
      navigation.navigate(
        'Screens' , {
          screen  : "OrderLists"
        }
      )
    } else if(item.name === 'Cart'){
      navigation.navigate(
        'Screens' , {
          screen  : "CartListScreen"
        }
      )
    }
    else if(item.name === 'Wishlists'){
      navigation.navigate(
        'Screens' , {
          screen  : "WishListScreen"
        }
      )
    }
    else if(item.name === 'Offers'){
      navigation.navigate(
        'Screens' , {
          screen  : "OrderLists"
        }
      )
    }
  }





  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fde800" />

      {/* HEADER */}
     <CollapsableHeader navigation={navigation}/>

      {/* QUICK ACTIONS */}
      <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <FlatList
          data={[
            { name: 'Orders', icon: <Box size={18} /> },
            { name: 'Cart', icon: <ShoppingBag size={18} /> },
            { name: 'Offers', icon: <PercentCircle size={18} /> },
            { name: 'Wishlists', icon: <Heart size={18} /> },
          ]}
          numColumns={2}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ gap: 12 , alignItems : 'center' , justifyContent : 'space-between' , paddingHorizontal : 10 , paddingBottom : 2 , }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                handleOption(item)
              }
              style={{
                width: width * 0.45,
                height: 60,
                marginHorizontal : 3,
                
                backgroundColor: '#fff',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,

                elevation: 2,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              {item.icon}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111',
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ACCOUNT SETTINGS */}
      <View style={{ alignItems: 'center', marginTop: 25 }}>
        <Text
          style={{
            width: width * 0.93,
            fontSize: 20,
            fontWeight: '700',
            color: '#111',
            marginBottom: 10,
          }}
        >
          Account Settings
        </Text>

        <View
          style={{
            width: width * 0.93,
            backgroundColor: '#fff',
            borderRadius: 14,
            paddingVertical: 6,
            elevation: 3,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
          }}
        >
          {[
            'Address',
            'Saved Locations',
            'Manage Addresses',
            'Delivery Preferences',
            'Customer & Support'
          ].map((label, index) => (
            <View key={label}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Screens', {
                    screen: 'LocationSettingScreen',
                  })
                }
                style={{
                  height: 52,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 14,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <LocationEdit size={18} color="#2563EB" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#222',
                    }}
                  >
                    {label}
                  </Text>
                </View>

                <ChevronRight size={18} color="#999" />
              </TouchableOpacity>

              {index !== 3 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#F0F0F0',
                    marginHorizontal: 14,
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};


export default Order