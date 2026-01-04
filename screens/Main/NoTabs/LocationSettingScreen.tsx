import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Dimensions, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Edit2, Smartphone, LocationEdit, MapPinHouse, Trash } from 'lucide-react-native';
import userStore from '../../../store/MyStore';

const { width } = Dimensions.get('screen');
const PAGE_LIMIT = 5;

const CollapsableHeader = ({ navigation }) => (
  <View style={{ width, height: 88, paddingTop: StatusBar.currentHeight || 24, paddingHorizontal: 16, backgroundColor: '#fde800ff', justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
        <ChevronLeft size={22} color="#111827" />
      </TouchableOpacity>
      <Text style={{ marginLeft: 4, fontSize: 18, fontWeight: '700', color: '#111827' }}>My Addresses</Text>
    </View>
  </View>
);

const AddressCard = ({address, deleteAddress, fetchAddressList , navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
        console.log("Mai chl gayay re")
        console.log(address)
        console.log(address._id)
    if (!address?._id || loading) return;

   
    setLoading(true);
    try {

      
      const response = await deleteAddress(address._id);
      if (response?.success) {
        
        fetchAddressList(1, 10, true);
      }

      
    } catch (error) {
      console.log('Delete address error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width, alignItems: 'center', marginTop: 10 }}>
      <View
        style={{
          width: width * 0.94,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          gap: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 5,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}
      >
        {/* ADDRESS LINE */}
        <View
          style={{
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#111827',
              lineHeight: 21,
            }}
          >
            {address.addressLine1 || address.fullAddress || 'Address'}
          </Text>
        </View>

        {/* CITY / DISTRICT */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <InfoBox label="City" value={address.city} />
            <InfoBox label="District" value={address.district} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <InfoBox label="State" value={address.state} />
            <InfoBox label="Country" value={address.country} />
          </View>
        </View>



        {/* MOBILE + PINCODE */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 8,
            backgroundColor: '#f8fafc',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.65 }}>
            <Smartphone size={18} color="#111827" />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 14,
                color: '#374151',
                fontWeight: '500',
              }}
            >
              {address.mobileNo?.[0] || address.mobile || 'N/A'}
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#d1d5db',
            }}
          >
            <Text style={{ fontWeight: '600', color: '#374151' }}>
              {address.pincode || '—'}
            </Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 8,
          }}
        >
         

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#e5e7eb',
                marginRight: 8,
              }}
            >
              <Edit2 size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              onPress={handleDelete}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: '#fee2e2',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#fecaca',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Trash size={20} color="#dc2626" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};



/* ---------- SMALL HELPER ---------- */

const InfoBox = ({ label, value }) => (
  <View style={{ flex: 0.48 }}>
    <Text
      style={{
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
        marginBottom: 4,
      }}
    >
      {label}
    </Text>
    <View
      style={{
        backgroundColor: '#f9fafb',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
      }}
    >
      <Text style={{ fontSize: 14, color: '#374151', fontWeight: '500' }}>
        {value || '—'}
      </Text>
    </View>
  </View>
);

const LocationType = ({ navigation }) => (
  <View style={{ width, alignItems: 'center', gap: 8, marginTop: 10, marginBottom: 4 }}>
    <TouchableOpacity onPress={() => navigation.navigate("LiveMapScreen")} style={{ width: width * 0.94, flexDirection: 'row', gap: 8, borderRadius: 10, borderWidth: 1, borderColor: '#a2a2a244', height: 56, elevation: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 16 }}>
      <LocationEdit size={18} />
      <Text style={{ fontWeight: '700', fontSize: 15 }}>Live Address</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ width: width * 0.94, flexDirection: 'row', gap: 8, borderRadius: 10, borderWidth: 1, borderColor: '#a2a2a244', height: 56, elevation: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 16 }}>
      <MapPinHouse size={18} />
      <Text style={{ fontWeight: '700', fontSize: 15 }}>Add Custom Address</Text>
    </TouchableOpacity>
  </View>
);

const LocationSettingScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
 
 
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const fetchAddress = userStore((state) => state.fetchAddress);
const deleteAddress = userStore((state) => state.deleteAddress);

  const fetchAddressList = useCallback(async (pageNumber = 1, limit = PAGE_LIMIT, reset = false) => {
    try {
      setLoading(true);
      const response = await fetchAddress(pageNumber, limit);
      
      if (response?.success) {
       setAddresses(prev =>reset ? response.AddressList : [...prev, ...response.AddressList]);
        setTotal(response.total || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log('Fetch addresses error:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [fetchAddress]);


  const onRefresh = useCallback(async () => {
  try {
    setRefreshing(true);
    await fetchAddressList(1, PAGE_LIMIT, true); // reset = true
  } catch (e) {
    console.log('Refresh error:', e);
  } finally {
    setRefreshing(false);
  }
}, [fetchAddressList]);



  useEffect(() => {
    fetchAddressList(1, PAGE_LIMIT, true);
  }, [fetchAddressList]);

  const loadMore = useCallback(() => {
    if (addresses.length < total && !loading) {
      fetchAddressList(page + 1, PAGE_LIMIT, false);
    }
  }, [addresses.length, total, loading, page, fetchAddressList]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <CollapsableHeader navigation={navigation} />
      <LocationType navigation={navigation} />
      
      <View style={{ width, alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: width * 0.94, paddingHorizontal: 7, height: 30, justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
            Saved Addresses ({addresses.length} of {total})
          </Text>
        </View>
      </View>

      <FlatList
        data={addresses}
        renderItem={({ item }) => <AddressCard  navigation = {navigation} address={item} deleteAddress={deleteAddress} fetchAddressList= {fetchAddressList}/>}
        keyExtractor={(item) => item._id?.toString() || item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
         refreshing={refreshing}
  onRefresh={onRefresh}
        ListEmptyComponent={
          initialLoading ? null : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>No addresses found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default LocationSettingScreen;
