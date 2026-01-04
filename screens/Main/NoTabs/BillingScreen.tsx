import { View, Text, Dimensions, StatusBar, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { ChevronLeft, MapPin, CreditCard, ShoppingBag, Smartphone, Wallet2, IndianRupee, CheckCircle2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import userStore from '../../../store/MyStore';


const { width } = Dimensions.get('window');




const SectionHeader = ({ icon: Icon, title }) => (
  <View style={styles.sectionHeader}>
    <Icon size={18} color="#111827" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);


const AddressCard = ({ address }) => (
  <View style={styles.cardContainer}>
    <SectionHeader icon={MapPin} title="Delivery Address" />
    <View style={styles.addressBody}>
      <Text style={styles.addressLine}>{address.addressLine1 || address.fullAddress || 'No Address Provided'}</Text>
      <Text style={styles.addressSub}>{address.city}, {address.state} - {address.pincode}</Text>
      <View style={styles.contactBadge}>
        <Smartphone size={14} color="#6b7280" />
        <Text style={styles.contactText}>{address.mobileNo?.[0] || address.mobile || 'N/A'}</Text>
      </View>
    </View>
  </View>
);

const Samaan = ({ detail }) => (
  <View style={styles.cardContainer}>
    <SectionHeader icon={ShoppingBag} title="Order Summary" />
    <View style={styles.productRow}>
      <Image source={{ uri: detail.productImage }} style={styles.productImg} resizeMode="contain" />
      <View style={styles.productDetails}>
        <Text style={styles.brandText}>{detail.brand}</Text>
        <Text style={styles.productName} numberOfLines={1}>{detail.ProductName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>Size: {detail.size || 'N/A'}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>Qty: {detail.quantity}</Text></View>
        </View>
      </View>
    </View>
  </View>
);

const Parcha = ({ bill }) => (
  <View style={styles.cardContainer}>
    <Text style={styles.priceHeading}>Price Details</Text>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>Price (1 item)</Text>
      <Text style={styles.priceValue}>₹{Number(bill?.VarientActualPrice) * Number(bill.quantity)}</Text>
    </View>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>Discount</Text>
      <Text style={[styles.priceValue, { color: '#10b981' }]}>- ₹{Number(bill?.VarientActualPrice - bill?.VarientDiscountedPrice)*Number(bill.quantity)}</Text>
    </View>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>Delivery Charges</Text>
      <Text style={[styles.priceValue, { color: '#10b981' }]}>FREE</Text>
    </View>
    <View style={[styles.priceRow, styles.totalRow]}>
      <Text style={styles.totalLabel}>Total Amount</Text>
      <Text style={styles.totalValue}>₹{Number(bill?.VarientDiscountedPrice )* Number(bill.quantity)}</Text>
    </View>
    <View style={styles.savingsBanner}>
      <Text style={styles.savingsText}>You will save ₹{Number(bill?.VarientActualPrice - bill?.VarientDiscountedPrice)*Number(bill?.quantity)} on this order</Text>
    </View>
  </View>
);

const PaymentMethod = ({ setPayment, Payment }) => {
  const methods = [
    { id: 'COD', name: 'Cash on Delivery' },
    { id: 'UPI', name: 'UPI' },
    { id: 'Paytm', name: 'Paytm' },
    { id: 'PhonePay', name: 'PhonePe' },
  ];

  return (
    <View style={styles.cardContainer}>
      <SectionHeader icon={CreditCard} title="Payment Method" />
      <FlatList
        data={methods}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => {
          const isSelected = Payment === item.id;
          return (
            <TouchableOpacity
              onPress={() => setPayment(item.id)}
              style={[styles.payCard, isSelected && styles.payCardSelected]}
            >
              {isSelected && <CheckCircle2 size={16} color="#facc15" style={styles.checkIcon} />}
              <Text style={[styles.payText, isSelected && styles.payTextSelected]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

// --- Main Screen ---

const BillingScreen = () => {
  const navigation = useNavigation();
  const [Payment, setPayment] = useState("COD");
  const [OrderLoading, setOrderLoading] = useState(false);
  const { OrderProduct , PlaceOnlinePaymentOrder , VerifyOnlinePayment } = userStore();
  const route = useRoute();
  const params = route.params;

  

const handleOrder = async () => {
  if (OrderLoading) return;

  setOrderLoading(true);

  try {
    const data = {
      productId: params?.productId,
      variantId: params?.varientId,
      size: params?.size,
      quantity: params.quantity ,
      actualMRP: params?.VarientActualPrice*Number(params?.quantity),
      discountedPrice: params?.VarientDiscountedPrice*Number(params?.quantity),
      appliedOfferId: params?.offerId || null,
      paymentDone: false,
      address: params?._id,
      paymentMethod: Payment,
    };

    // 🔹 ONLINE PAYMENT FLOW
    if (Payment === "UPI") {

      const orderIdRes = await PlaceOnlinePaymentOrder(data);



      

      const verifyRes = await VerifyOnlinePayment({
        ...orderIdRes.verificationData,
      });


      if(verifyRes.success){

        console.log("kkkl")

const orderRes = await OrderProduct({
        ...data,
        paymentDone: true,
        paymentMethod: Payment,
        paymentId : verifyRes.paymentDoc._id
      });


      if (orderRes.success) {
       
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "ProductDetail",
              params: {
                productId: params?.productId,
                varientId: params?.varientId,
              },
            },
          ],
        });
      }



      }
      

      
    }

    // 🔹 CASH ON DELIVERY FLOW
    else if (Payment === "COD") {
      const orderRes = await OrderProduct({...data});

      if (orderRes.success) {
      

        navigation.reset({
          index: 0,
          routes: [
            {
              name: "ProductDetail",
              params: {
                productId: params?.productId,
                varientId: params?.varientId,
              },
            },
          ],
        });
      }
    }

  } catch (error) {
    console.log("handleOrder error:", error);
  
  } finally {
    setOrderLoading(false);
  }
};


  const sections = [
    { id: 'address', render: () => <AddressCard address={params} /> },
    { id: 'items', render: () => <Samaan detail={params} /> },
    { id: 'payment', render: () => <PaymentMethod setPayment={setPayment} Payment={Payment} /> },
    { id: 'bill', render: () => <Parcha bill={params} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fde800" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item.render()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>₹{Number(params?.VarientDiscountedPrice)*Number(params.quantity)}</Text>
          <Text style={styles.viewDetails}>View Detailed Bill</Text>
        </View>
        <TouchableOpacity 
          disabled={OrderLoading} 
          onPress={handleOrder} 
          style={styles.orderBtn}
        >
          {OrderLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.orderBtnText}>Place Order</Text>}
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
};

export default BillingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    height: 80,
    paddingTop : StatusBar.currentHeight,
    backgroundColor: '#fde800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginLeft: 8 },
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 },
  addressLine: { fontSize: 16, fontWeight: '600', color: '#111827' },
  addressSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  contactBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6, backgroundColor: '#f3f4f6', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  contactText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  productRow: { flexDirection: 'row', gap: 16 },
  productImg: { width: 70, height: 90, borderRadius: 8, backgroundColor: '#f9fafb' },
  productDetails: { flex: 1, justifyContent: 'center' },
  brandText: { fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' },
  productName: { fontSize: 16, color: '#111827', fontWeight: '500', marginVertical: 4 },
  metaRow: { flexDirection: 'row', gap: 8 },
  badge: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 12, color: '#4b5563' },
  priceHeading: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { color: '#6b7280', fontSize: 14 },
  priceValue: { color: '#111827', fontSize: 14, fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#111827' },
  savingsBanner: { backgroundColor: '#ecfdf5', padding: 10, borderRadius: 8, marginTop: 10 },
  savingsText: { color: '#059669', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  payCard: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f9fafb', borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  payCardSelected: { borderColor: '#fde800', backgroundColor: '#fffde7' },
  payText: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  payTextSelected: { color: '#111827', fontWeight: '700' },
  checkIcon: { marginBottom: 4 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingBottom: 10
  },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: '#111827' },
  viewDetails: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  orderBtn: { backgroundColor: '#fde800', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, elevation: 3 },
  orderBtnText: { fontSize: 16, fontWeight: '700', color: '#111827' }
});