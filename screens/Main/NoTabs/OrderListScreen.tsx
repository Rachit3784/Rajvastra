import React, { useEffect, useState, useCallback } from 'react';
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
import { ChevronLeft } from 'lucide-react-native';
import userStore from '../../../store/MyStore';

const { width } = Dimensions.get('screen');
const PAGE_LIMIT = 10;

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
        Orders
      </Text>
    </View>
  </View>
);

/* ================= STATUS COLORS ================= */

const ORDER_STATUS_COLORS = {
  Ordered: '#2563EB',
  Viewed: '#0EA5E9',
  Packed: '#8B5CF6',
  Shipped: '#F59E0B',
  NearTown: '#F97316',
  Delivered: '#16A34A',
  CancelledBySeller: '#DC2626',
  CancelledByCustomer: '#991B1B',
};

/* ================= ORDER CARD ================= */

const OrderCard = ({ order, onPress }) => {
  const product = order?.variantId;
  const address = order?.address;
  const statusColor = ORDER_STATUS_COLORS[order?.orderStatus] || '#6B7280';

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
          width: 78,
          height: 90,
          borderRadius: 12,
          backgroundColor: '#F3F4F6',
          overflow: 'hidden',
        }}
      >
        {product?.coverImage ? (
          <Image
            source={{ uri: product.coverImage }}
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
          {product?.ProductName}
        </Text>

        <Text style={{ marginTop: 4, fontSize: 13, color: '#6B7280' }}>
          Qty: {order.quantity}
        </Text>

        {/* ✅ Address */}
        <Text
          numberOfLines={2}
          style={{ marginTop: 4, fontSize: 12, color: '#6B7280' }}
        >
          {address?.addressType
            ? `${address.addressType} • `
            : ''}
          {address?.city}
          {address?.pincode ? ` - ${address.pincode}` : ''}
        </Text>

        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700' }}>
            ₹{order.netAmount}
          </Text>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              backgroundColor: `${statusColor}20`,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: statusColor }}>
              {order.orderStatus}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ================= SCREEN ================= */

const OrderListScreen = () => {
  const navigation = useNavigation();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchOrders = userStore((state) => state.fetchOrders);

  const fetchOrdersList = useCallback(
    async (pageNumber = 1, limit = PAGE_LIMIT, reset = false) => {
      try {
        setLoading(true);

        const response = await fetchOrders(pageNumber, limit);

        const list = Array.isArray(response?.orders)
          ? response.orders
          : [];

        if (response?.success) {
          setOrders((prev) => (reset ? list : [...prev, ...list]));
          setTotal(response?.total || 0);
          setPage(pageNumber);
        }
      } catch (err) {
        console.log('Fetch Orders error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setInitialLoading(false);
      }
    },
    [fetchOrders]
  );

  useEffect(() => {
    fetchOrdersList(1, PAGE_LIMIT, true);
  }, [fetchOrdersList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrdersList(1, PAGE_LIMIT, true);
  }, [fetchOrdersList]);

  const loadMore = useCallback(() => {
    if (Array.isArray(orders) && orders.length < total && !loading) {
      fetchOrdersList(page + 1, PAGE_LIMIT);
    }
  }, [orders, total, loading, page, fetchOrdersList]);

  const renderFooter = () =>
    loading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6'}}>

      <CollapsableHeader navigation={navigation} />

     
         <FlatList
       
        data={orders}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() =>
              navigation.navigate('OrderDetailScreen' , {item})
            }
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          initialLoading ? null : (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: '#6B7280' }}>No Orders found</Text>
            </View>
          )
        }
      />
     
    </View>
  );
};

export default OrderListScreen;
