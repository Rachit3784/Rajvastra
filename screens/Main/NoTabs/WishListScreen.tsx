import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Box, ChevronLeft, Trash } from 'lucide-react-native';
import userStore from '../../../store/MyStore';

const { width } = Dimensions.get('screen');


/* ================= HEADER ================= */

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
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronLeft size={22} color="#111827" />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 4,
          fontSize: 18,
          fontWeight: '700',
          color: '#111827',
        }}
      >
        WishLists
      </Text>
    </View>
  </View>
);




/* ================= ORDER CARD ================= */

const CartCard = ({ cart, onPress ,deleteWishlists , setCarts}) => {

  const pricingList = cart?.variantId?.pricing;
  const [deleting , setDeleting] = useState(false);
  


  const netAmount = Array.isArray(pricingList)
    ? pricingList.find(item => item.size === cart.size)
    : null;

    const handleDelete = async ()=>{
      setDeleting(true);
      try{

        const response = await deleteWishlists(cart._id);
        if(response.success){
           setCarts(prevCart => prevCart.filter(item => item._id !== cart._id)) 
        }

      }catch(error){
         console.log(error)
      }finally{
setTimeout(()=>{
setDeleting(false)
},500)
      }
    }

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        marginHorizontal: 12,
        marginTop: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        elevation: 1,
      }}
    >
      {/* Image */}
      <View
        style={{
          width: 90,
          height: 100,
          borderRadius: 12,
          backgroundColor: '#F3F4F6',
          overflow: 'hidden',
        }}
      >
        {cart?.variantId?.coverImage ? (
          <Image
            source={{ uri: cart.variantId.coverImage }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>No Image</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text numberOfLines={2} style={{ fontSize: 15, fontWeight: '600' }}>
          {cart?.variantId?.ProductName}
        </Text>

        <View style = {{flexDirection : 'row' , gap : 7 , alignItems : 'center'}}>
            <Text style={{ marginTop: 4, fontSize: 13, color: '#6B7280' }}>
          Qty: {cart.quantity}
        </Text>

        <Text style={{ marginTop: 4, fontSize: 13, color: '#6B7280' }}>
          Size: {cart.size}
        </Text>
        </View>

        <View
          style={{
            marginTop: 8,
           
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700' }}>
            ₹{netAmount?.discountedPrice ?? 0}
          </Text>

          
            
            <TouchableOpacity
          onPress={handleDelete}
          disabled = {deleting}
          style = {{height : 40,width : 40 , borderRadius : 10 , 
            alignItems : 'center' , justifyContent : 'center' }}>
      { deleting ?   ( <ActivityIndicator size={20} color={'#000'}/>) :  (<Trash size={21} />)}
          </TouchableOpacity>


        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ================= SCREEN ================= */


const PAGE_LIMIT = 10;

const WishListScreen = () => {
  const [carts, setCarts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();



  // Use a Ref to track loading status instantly (State updates are async)
  const isFetchingBus = useRef(false);

  const fetchWishLists = userStore((state) => state.fetchWishLists);
  const deleteWishlists = userStore((state)=>state.deleteWishlists);
 

  const fetchCartsList = useCallback(
    async (pageNumber = 1, reset = false) => {
      // 1. Instant check to prevent duplicate calls
      if (isFetchingBus.current) return;
      if (!reset && !hasMore) return;

      isFetchingBus.current = true;
      if (!reset) setLoading(true);

      try {
        const response = await fetchWishLists(pageNumber, PAGE_LIMIT);
        const newList = Array.isArray(response?.carts) ? response.carts : [];

        if (response?.success) {
          setCarts((prev) => {
            if (reset) return newList;
            
            // 2. Extra Safety: Filter out duplicates just in case
            const existingIds = new Set(prev.map(item => item._id));
            const uniqueNewItems = newList.filter(item => !existingIds.has(item._id));
            return [...prev, ...uniqueNewItems];
          });

          setPage(pageNumber);
          // If we got less than the limit, there's no more data
          setHasMore(newList.length === PAGE_LIMIT);
        }
      } catch (err) {
        console.error('Fetch Cart error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        isFetchingBus.current = false; // Release the lock
      }
    },
    [fetchWishLists, hasMore]
  );

  // Initial Fetch
  useEffect(() => {
    fetchCartsList(1, true);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchCartsList(1, true);
  }, [fetchCartsList]);

  const loadMore = () => {
    // Only trigger if we aren't already loading and there is more to fetch
    if (!isFetchingBus.current && hasMore) {
      fetchCartsList(page + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

        <CollapsableHeader navigation={navigation}/>
      <FlatList
        data={carts}
        // Use a fallback for key to prevent crashes
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <CartCard
            cart={item}
            setCarts={setCarts}
            deleteWishlists={deleteWishlists}
            onPress={() => {
                navigation.navigate('ProductDetail', { 
                varientId: item.variantId._id, 
                productId: item.productId 
            })
        }
        }
          />
        )}

        contentContainerStyle = {{paddingBottom : 100}}
        
        // standard FlatList pagination props
        onEndReached={loadMore}
        onEndReachedThreshold={0.3} // Trigger when user is 30% from bottom
        
        ListFooterComponent={loading ? <ActivityIndicator size={18} style={{ margin: 50 }} /> : null}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={!loading && <Text>No items found</Text>}
      />

    </View>
  );
};

export default WishListScreen;