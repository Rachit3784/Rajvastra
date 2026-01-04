import { View, Text, TouchableOpacity, StatusBar, Dimensions, Image } from 'react-native'
import React from 'react'
import { ArrowLeft, ChevronLeft, MapPin, Smartphone } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';



const {width} = Dimensions.get('screen');



const CollapsableHeader = ({ navigation }) => (
  <View
    style={{
      width,
      height: 88,
      paddingTop: StatusBar.currentHeight || 24,
      paddingHorizontal: 16,
      flexDirection : 'row',
      alignItems : 'center',
      backgroundColor: '#fde800ff',
      justifyContent: 'space-between',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center'  }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowLeft size={22} color="#111827" />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 0,
          fontSize: 18,
          fontWeight: '700',
          color: '#111827',
        }}
      >
        Orders
      </Text>
    </View>

    

        <TouchableOpacity style = {{width : 70 , height : 35 , alignItems : 'center' , justifyContent : 'center', borderRadius : 10 , borderWidth : 1 , borderColor : '#000'}}>
            <Text>
                Help
            </Text>
        </TouchableOpacity>

  </View>
);


const OrderInfo = ({ item }) => {
  return (
    <View
      style={{

      width,
      marginTop : 5,
        padding: 16,
        
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      {/* Image */}
      <View
        style={{
          width: 95,
          height: 120,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#f1f1f1',
        }}
      >
        <Image
          source={{ uri: item?.variantId?.coverImage }}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      {/* Info */}
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingVertical: 4,
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: '#111',
          }}
        >
          {item?.variantId?.ProductName}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 13, color: '#555' ,  fontWeight :'500' }}>
            Size: <Text style={{ fontWeight: '500' }}>{item?.size}</Text>
          </Text>

          <Text style={{ fontSize: 13, color: '#555', fontWeight :'500' }}>
            Qty: <Text style={{ fontWeight: '500' }}>{item?.quantity}</Text>
          </Text>
        </View>


       <View style = {{flexDirection : 'row' , gap : 5}}>
         <Text style = {{color : '#000' , fontWeight : '500' ,fontSize : 13 }}>
             Net Amount :
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#0a7cff',
          }}
        >
          ₹{item?.netAmount}
        </Text>

       </View>

       <View style = {{flexDirection : 'row' , alignItems : 'center'}}>
        <Text style = {{fontSize : 13 , fontWeight : '500'}}>Payment Mode : </Text>

        <View
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor:
              item?.paymentMethod === 'COD' ? '#fff4e5' : '#e8f5e9',
          }}
        >

            
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color:
                item?.paymentMethod === 'COD' ? '#ff9800' : '#2e7d32',
            }}
          >
            {item?.paymentMethod}
          </Text>
        </View>
       </View>
        
      </View>
    </View>
  )
}

const OrderAddress = ({ address }) => {
  return (
    <View
      style={{
        width: '100%',
        padding: 16,
        marginTop: 5,
        backgroundColor: '#fff',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 1,
        gap: 10,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <MapPin size={16} color="#0a7cff" />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#111',
            textTransform: 'capitalize',
          }}
        >
         Delivery Details : {address?.addressType} Address
        </Text>
      </View>

      {/* Address Lines */}
      <Text
        style={{
          fontSize: 13,
          color: '#444',
          lineHeight: 18,
        }}
      >
        {address?.addressLine1}
      </Text>

      {address?.addressLine2 ? (
        <Text
          style={{
            fontSize: 13,
            color: '#444',
            lineHeight: 18,
          }}
        >
          {address?.addressLine2}
        </Text>
      ) : null}

      {/* City / State / Pincode */}
      <Text
        style={{
          fontSize: 13,
          color: '#555',
        }}
      >
        {address?.city}, {address?.state} -{' '}
        <Text style={{ fontWeight: '600', color: '#111' }}>
          {address?.pincode}
        </Text>
      </Text>

      {/* Landmark */}
      {address?.landmark ? (
        <Text
          style={{
            fontSize: 12,
            color: '#777',
          }}
        >
          Landmark: {address?.landmark}
        </Text>
      ) : null}

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: '#eee',
          marginVertical: 6,
        }}
      />

      {/* Mobile Numbers */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Smartphone size={14} color="#555" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {address?.mobileNo?.map((item, index) => (
            <Text
              key={index}
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: '#111',
              }}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}




const OrderDetailScreen = () => {
    const route = useRoute();

    const navigation = useNavigation();

    const params = route?.params

    
  return (
    <View style = {{flex : 1}}>

        <CollapsableHeader navigation={navigation} />
        <OrderInfo item={params?.item}/>
        <OrderAddress address={params?.item.address}/>
        
        <Text>OrderDetailScreen</Text>
    </View>
  )
}

export default OrderDetailScreen