import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  FlatList,
  
} from 'react-native'
import React, { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Bell, Search, ShoppingBag, Star, UserCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('screen')

/* =========================
   CATEGORY / STORIES
========================= */


const Categories = ({ data }) => {
  const CategoryItem = ({ imageUri, title }) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          marginHorizontal: 10,
        }}
      >
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 35,
            
            padding: 2,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 33,
              backgroundColor: '#eee',
            }}
            resizeMode="cover"
          />
        </View>

        <Text
          numberOfLines={1}
          style={{
            marginTop: 4,
            fontSize: 11,
            fontWeight: '500',
            color: '#111',
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <FlatList
      data={data}
      horizontal
      
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <CategoryItem imageUri={item.imageUri} title={item.title} />
      )}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />

    <View style = {{marginVertical : 10}} ></View>
    <FlatList
      data={data}
      horizontal
      
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <CategoryItem imageUri={item.imageUri} title={item.title} />
      )}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
    </View>
  )
}


const CategorySection = ({categories})=>{


  return (
    <View style={{ marginTop: 15 }}>
          
           <View style = {{width , paddingLeft : 10 , alignItems : 'flex-start' , marginBottom : 10}}>
            <Text style = {{fontSize : 15 , fontWeight : '600' , color : '#000' }}>Categories</Text>
           </View>
          <Categories data={categories} />

        </View>
  )
}

const AutomaticCorousel2 = ({categories})=>{

const Banner = ({BannerItem})=>{
          return (
            <View style = {{position : 'relative', width  ,  height : 570 , overflow : 'hidden' , backgroundColor : 'blue',}}>
               <Image source={require('../../../asset/jacketbanner.png')} resizeMode='cover' style = {{height  :'100%' , width : '100%'}}/>
                
                <View style = {{ position : 'absolute' , bottom : 10, left : 5, alignItems : 'flex-start' , gap : 2}}>
                  <Text style = {{fontSize : 17 , fontWeight : '800' }}>{BannerItem.title}</Text>
                  
                </View>

                <TouchableOpacity style = {{ position : 'absolute' , bottom : 10, right : 10,   width : 100 , padding : 10, height : 40  , justifyContent : 'center',  alignItems : 'center' , flexDirection : 'row', borderRadius : 5 , backgroundColor : '#ffff36ff'}}>
                   <Text style = {{color : '#000', fontSize : 10, fontWeight : '600'}}>Explore Now</Text>
                   <ArrowRight color={'black'} size={15}/>
                </TouchableOpacity>

            </View>
          )
  }


  return (
    <View style = {{width}}>

    <FlatList 
    data={categories}
    keyExtractor={(item,index)=>item.id}
    contentContainerStyle = {{ alignItems : 'center'}}
    renderItem={({item})=><Banner BannerItem={item} />}
    horizontal
    pagingEnabled
    />

    </View>
  )

}

const AutomaticCorousel = ({categories})=>{

  const Banner = ({BannerItem})=>{
          return (
            <View style = {{position : 'relative', width : width*0.9 , borderRadius : 10 , height : 350 , overflow : 'hidden'}}>
               <Image source={{uri : BannerItem.imageUri}} resizeMode='cover' style = {{height  :'100%' , width : '100%'}}/>
                
                <View style = {{ position : 'absolute' , bottom : 10, left : 5, alignItems : 'flex-start' , gap : 2}}>
                  <Text style = {{fontSize : 17 , fontWeight : '800' }}>{BannerItem.title}</Text>
                  {/* <Text>{BannerItem.subtitle}</Text> */}
                </View>

                <TouchableOpacity style = {{ position : 'absolute' , bottom : 10, right : 10,   width : 100 , padding : 10, height : 40  , justifyContent : 'center',  alignItems : 'center' , flexDirection : 'row', borderRadius : 5 , backgroundColor : '#ffff36ff'}}>
                   <Text style = {{color : '#000', fontSize : 10, fontWeight : '600'}}>Explore Now</Text>
                   <ArrowRight color={'black'} size={15}/>
                </TouchableOpacity>

            </View>
          )
  }

  return (
    <View style = {{width  , padding : 10 , marginTop : 5}}>
    <View style = {{padding : 10 , paddingLeft : 7}}>
      <Text style = {{fontWeight : '600' , fontSize : 15}}>
        Highlights
      </Text>
    </View>
    <FlatList 
    data={categories}
    keyExtractor={(item,index)=>item.id}
    contentContainerStyle = {{gap  : 10 , alignItems : 'center' , paddingLeft : 10}}
    renderItem={({item})=><Banner BannerItem={item} />}
    horizontal
    pagingEnabled
    />

    </View>
  )

}


const TrendingSection = ({ TrendingItem }) => {

  const ProductCard = ({ product }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          width: width * 0.5,
          
          padding: 6,
        }}
      >
        <View
          style={{
            
            borderRadius: 8,
            overflow: 'hidden',
           
            
          }}
        >
          {/* IMAGE */}
          <View style={{ height: 190 , overflow : 'hidden' , borderRadius : 10}}>
            <Image
              source={{ uri: product.imageUri }}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
            />

            {/* DISCOUNT */}
            <View
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                backgroundColor: '#f2f2f2',
                paddingHorizontal: 5,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: '#333',
                  fontWeight: '500',
                }}
              >
                {product.discountsPercentage}% OFF
              </Text>
            </View>
          </View>

          {/* CONTENT */}
          <View style={{ paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{product.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{product.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {product.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {product.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {product.brand}
  </Text>

</View>



        </View>
      </TouchableOpacity>
    );
  };

  return (

    <View style = {{width}}>
      <View style = {{paddingHorizontal : 15 , paddingVertical : 5, width , flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center'}}>
         
      <Text style = {{fontWeight : '600' , fontSize : 15}}>
        Highlights
      </Text>
  

         <TouchableOpacity style = {{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'center' , gap : 1 , padding : 2 , width : 100}}>
          <Text style = {{fontSize :14 , color : '#000' , fontWeight : '600'}}>View all</Text>
          <ArrowRight size={16}/>
         </TouchableOpacity>
      </View>
      <FlatList
      data={TrendingItem}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle = {{  alignItems : 'center'}}
      renderItem={({ item }) => <ProductCard product={item} />}
      showsVerticalScrollIndicator={false}
    />
    </View>

  );
};


const ITEM_HEIGHT = 300
const GAP = 8
const RIGHT_ITEM_HEIGHT = (ITEM_HEIGHT - GAP) / 2

const DressingPattern = ({ product = [] }) => {
  const left = product[0]
  const rightTop = product[1]
  const rightBottom = product[2]

  return (
    <View style = {{width}}>
  

   <View style = {{width , padding : 10 , paddingLeft : 15}}>
  <Text style = {{fontSize : 15 , fontWeight : '600' }}>
    New Patterns
  </Text>
   </View>


      <View
      style={{
        width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        
      }}
    >
      {/* LEFT */}
      {left && (
          <View style = {{width: width * 0.47, height: ITEM_HEIGHT ,  borderRadius: 10, overflow: 'hidden'}}>
            
            <Image
            source={{ uri: left.imageUri }}
            style={{ width: '100%', height: '100%' ,borderRadius: 10}}
          />



           <View style={{position : 'absolute' ,backgroundColor : '#28282842', right : 0 , bottom : 0 , left : 0, paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{left.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{left.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {left.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {left.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {left.brand}
  </Text>

</View>




            </View>
      )}

      {/* RIGHT */}
      <View
        style={{
          width: width * 0.47,
          paddingRight : 5,
          justifyContent: 'space-between',
        }}
      >
        {rightTop && (

 <View style={{ height: RIGHT_ITEM_HEIGHT , borderRadius: 10, overflow: 'hidden' }}>
            <Image
              source={{ uri: rightTop.imageUri }}
              style={{ width: '100%', height: '100%' }}
            />

 <View style={{ position  : 'absolute' , backgroundColor : '#28282842', bottom : 0 , right : 0 , left : 0, paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{left.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{left.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {left.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {left.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {left.brand}
  </Text>

</View>


          </View>


        )}

        {rightBottom && (




  <View style={{ height: RIGHT_ITEM_HEIGHT , borderRadius: 10, overflow: 'hidden' }}>
            <Image
              source={{ uri: rightBottom.imageUri }}
              style={{ width: '100%', height: '100%' }}
            />




            
             <View style={{position : 'absolute' ,backgroundColor : '#28282842', bottom : 0 , right : 0 , left : 0 , paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{left.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{left.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {left.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {left.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {left.brand}
  </Text>

</View>



          </View>



        )}
      </View>
    </View>
    </View>
  )
}



const DressingPattern2 = ({ product = [] }) => {
  const left = product[0]
  const rightTop = product[1]
  const rightBottom = product[2]

  return (
    <View style = {{width}}>
  

   <View style = {{width , padding : 10 , paddingLeft : 15}}>
  <Text style = {{fontSize : 15 , fontWeight : '600' }}>
    New Patterns
  </Text>
   </View>


      <View
      style={{
        width,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
    >

      {/* left */}

     <View
        style={{
          width: width * 0.47,
          paddingLeft : 5,
          gap : 10,
          justifyContent: 'space-between',
        }}
      >
        {rightTop && (

 <View style={{ height: RIGHT_ITEM_HEIGHT + 10  , borderRadius: 10, overflow: 'hidden' }}>
            <Image
              source={{ uri: rightTop.imageUri }}
              style={{ width: '100%', height: '100%' }}
            />

 <View style={{ position  : 'absolute' , backgroundColor : '#28282842', bottom : 0 , right : 0 , left : 0, paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{left.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{left.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {left.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {left.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {left.brand}
  </Text>

</View>


          </View>


        )}

        {rightBottom && (




  <View style={{ height: RIGHT_ITEM_HEIGHT + 10  , borderRadius: 10, overflow: 'hidden' }}>
            <Image
              source={{ uri: rightBottom.imageUri }}
              style={{ width: '100%', height: '100%' }}
            />




            
             <View style={{position : 'absolute' ,backgroundColor : '#28282842', bottom : 0 , right : 0 , left : 0 , paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{left.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{left.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {left.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {left.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {left.brand}
  </Text>

</View>



          </View>



        )}
      </View>

      {/* RIGHT */}
      <View
        style={{
          width: width * 0.47,
          paddingRight : 5,
          justifyContent: 'space-between',
        }}
      >
        {rightTop && (

 <View style={{ height: RIGHT_ITEM_HEIGHT  + 10, borderRadius: 10, overflow: 'hidden' }}>
            <Image
              source={{ uri: rightTop.imageUri }}
              style={{ width: '100%', height: '100%' }}
            />

 <View style={{ position  : 'absolute' , backgroundColor : '#28282842', bottom : 0 , right : 0 , left : 0, paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{left.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{left.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {left.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {left.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {left.brand}
  </Text>

</View>


          </View>


        )}

        {rightBottom && (




  <View style={{ height: RIGHT_ITEM_HEIGHT + 10, borderRadius: 10, overflow: 'hidden' }}>
            <Image
              source={{ uri: rightBottom.imageUri }}
              style={{ width: '100%', height: '100%' }}
            />




            
             <View style={{position : 'absolute' ,backgroundColor : '#28282842', bottom : 0 , right : 0 , left : 0 , paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{left.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{left.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {left.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {left.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {left.brand}
  </Text>

</View>



          </View>



        )}
      </View>


    </View>
    </View>
  )
}


const HorizontalScrollingProducts = ({products = []})=>{


    const ProductCard = ({ product }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          width: width * 0.5,
          
          padding: 6,
        }}
      >
        <View
          style={{
            
            borderRadius: 8,
            overflow: 'hidden',
           
            
          }}
        >
          {/* IMAGE */}
          <View style={{ height: 190 , overflow : 'hidden' , borderRadius : 10}}>
            <Image
              source={{ uri: product.imageUri }}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
            />

            {/* DISCOUNT */}
            <View
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                backgroundColor: '#f2f2f2',
                paddingHorizontal: 5,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: '#333',
                  fontWeight: '500',
                }}
              >
                {product.discountsPercentage}% OFF
              </Text>
            </View>
          </View>

          {/* CONTENT */}
          <View style={{ paddingHorizontal: 8, paddingVertical: 6, gap: 4 }}>

  {/* PRICE + RATING */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {/* PRICE */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#111',
          letterSpacing: -0.3,
        }}
      >
        ₹{product.discountedPrice}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: '#9a9a9a',
          textDecorationLine: 'line-through',
        }}
      >
        ₹{product.actualMRP}
      </Text>
    </View>

    {/* RATING */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Star size={10} fill="#ffb300" />
      <Text
        style={{
          fontSize: 11,
          marginLeft: 3,
          color: '#333',
          fontWeight: '500',
        }}
      >
        {product.rating}
      </Text>
    </View>
  </View>

  {/* PRODUCT NAME */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 13,
      fontWeight: '500',
      color: '#1a1a1a',
      lineHeight: 16,
    }}
  >
    {product.name}
  </Text>

  {/* BRAND */}
  <Text
    style={{
      fontSize: 11,
      color: '#7a7a7a',
    }}
  >
    {product.brand}
  </Text>

</View>



        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View style = {{width}}>

      <View style = {{width , padding : 10 , paddingLeft : 15}} >
         <Text style = {{fontSize : 15 , fontWeight : '600'}}>Popular</Text>

      </View>

      <FlatList 
      data={products}
      keyExtractor={(item,index)=>item.id}
      horizontal
      renderItem={({item})=><ProductCard product={item} />}

      />

    </View>
  )

}

const Profile = () => {


  const navigation = useNavigation()
  const [loading , setLoading] = useState(false);
  const [hasMore , sethasMore] = useState(true);







const handleScroll = (event) => {

  if(loading || !hasMore) return;

  const { contentOffset, layoutMeasurement, contentSize } =
    event.nativeEvent

  if (
    contentOffset.y + layoutMeasurement.height >=
    contentSize.height - 100
  ) {
    countRef.current += 1
    console.log("Reached the end", countRef.current)
  }
}


  const categories = [
    {
      id: 1,
      title: 'T-Shirts',
      imageUri:
        'https://static.aceomni.cmsaceturtle.com/prod/product-image/aceomni/Wrangler/Monobrand/WWSH001333/WWSH001333_1.jpg',
    },
    {
      id: 2,
      title: 'Hoodies',
      imageUri:
        'https://www.deshidukan.in/cdn/shop/files/NASA-2405-RB_1200x1200.jpg',
    },
    {
      id: 3,
      title: 'Shirts',
      imageUri:
        'https://static.aceomni.cmsaceturtle.com/prod/product-image/aceomni/Wrangler/Monobrand/WWSH001333/WWSH001333_1.jpg',
    },
    {
      id: 4,
      title: 'Jeans',
      imageUri:
        'https://m.media-amazon.com/images/I/71sOrDZno+L._AC_UF894,1000_QL80_.jpg',
    },
    {
      id: 5,
      title: 'Jackets',
      imageUri:
        'https://www.highstar.in/cdn/shop/files/5_c3f5e6c3-de13-4e46-8553-db9f954d276d.jpg',
    },
  ]

const products = [
  
  {
    id: 2,
    name: 'Hoodies',
    brand: 'Nike',
    rating: 8.5,
    actualMRP: 1200,
    discountedPrice: 899,
    discountsPercentage: 25,
    imageUri:
      'https://www.deshidukan.in/cdn/shop/files/NASA-2405-RB_1200x1200.jpg',
  },
  {
    id: 3,
    name: 'Shirts',
    brand: 'Wrangler',
    rating: 8.8,
    actualMRP: 1500,
    discountedPrice: 1099,
    discountsPercentage: 27,
    imageUri:
      'https://static.aceomni.cmsaceturtle.com/prod/product-image/aceomni/Wrangler/Monobrand/WWSH001333/WWSH001333_1.jpg',
  },
  {
    id: 4,
    name: 'Jeans',
    brand: 'Levis',
    rating: 9.1,
    actualMRP: 2200,
    discountedPrice: 1699,
    discountsPercentage: 23,
    imageUri:
      'https://m.media-amazon.com/images/I/71sOrDZno+L._AC_UF894,1000_QL80_.jpg',
  },
  {
    id: 5,
    name: 'Jackets',
    brand: 'Highstar',
    rating: 8.7,
    actualMRP: 3500,
    discountedPrice: 2699,
    discountsPercentage: 23,
    imageUri:
      'https://www.highstar.in/cdn/shop/files/5_c3f5e6c3-de13-4e46-8553-db9f954d276d.jpg',
  },
];




  const rendeComponents = [
    {
    id : 'banner1',
    component : <AutomaticCorousel2 categories={categories} />
  } , 
    {
    
    id : 'category',
    component : <CategorySection categories={categories}/>
  } , {
    id : 'banner',
    component : <AutomaticCorousel categories={categories} />
  } , 
  {
    id : 'trending-products',
    component : <TrendingSection TrendingItem={products} />
  } , 

  {
    id : 'dressing-pattern',
    component : <DressingPattern product={products} />
  },{
    id : 'dressing-pattern-2',
    component : <DressingPattern2 product={products}/>
  },
  {
    id : 'horizontal-items',
    component : <HorizontalScrollingProducts products={products}/>
  }

]


  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar
  translucent
  backgroundColor="transparent"
  barStyle="dark-content"
/>

      {/* ================= HEADER ================= */}
     <View
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'transparent',
    zIndex: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  }}
>
        <TouchableOpacity>
          <UserCircle size={24} color="#111827" />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 5 }}>
          {[Search, Bell, ShoppingBag].map((Icon, index) => (
            <TouchableOpacity

            onPress={()=>{
           

              navigation.navigate('Screens', {
                        screen: 'SearchProductScreen'})
                        

              
            }}
              key={index}
              style={{
                height: 36,
                width: 36,
                borderRadius: 18,
                
                alignItems: 'center',
                justifyContent: 'center',
                
              }}
            >
              <Icon size={18} color="#111" />
            </TouchableOpacity>
          ))}
        </View>

        
      </View>

      
      <FlatList 
      
      data={rendeComponents}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      keyExtractor={(item)=>item.id}
      renderItem={({item})=>item.component}

      />


<View style = {{ marginBottom : 60}}>

</View>

    </View>
  )
}








export default Profile
