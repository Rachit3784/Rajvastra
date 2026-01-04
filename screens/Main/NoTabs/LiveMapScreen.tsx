
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { ChevronLeft, Home, Briefcase, MapPin, Shirt, MapPinHouse } from 'lucide-react-native';
import userStore from '../../../store/MyStore';

const LiveLocationMapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const { addAddress } = userStore();

  const [initialRegion, setInitialRegion] = useState(null);
  const [markerCoord, setMarkerCoord] = useState(null);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    mobileNum : '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    addressType: 'home',
    latitude: null,
    longitude: null,
  });

  /* ================= LOCATION ================= */

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      const fineGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const coarseGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      return fineGranted || coarseGranted;
    } catch (e) {
      console.log('Permission error', e);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const ok = await requestLocationPermission();
    if (!ok) {
      setLoading(false);
      return;
    }

   
    
    // Geolocation.getCurrentPosition(
    //   pos => {
    //     const { latitude, longitude } = pos.coords;

    //     const region = {
    //       latitude,
    //       longitude,
    //       latitudeDelta: 0.01,
    //       longitudeDelta: 0.01,
    //     };

    //     setInitialRegion(region);
    //     setMarkerCoord({ latitude, longitude });
    //     fetchAddress(latitude, longitude);
    //     setLoading(false);
    //   },
    //   err => {
    //     console.log('Location error', err);
    //     setLoading(false);
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 2000,
    //     maximumAge: 10000,
    //     distanceFilter: 0,
    //   },
    // );
    
     
  Geolocation.getCurrentPosition(
  pos => {
    const { latitude, longitude } = pos.coords;
    setInitialRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setMarkerCoord({ latitude, longitude });
    setLoading(false);

    // fetchAddress can be async later
    fetchAddress(latitude, longitude);
  },
  err => {
    console.log('Location error', err);
    setLoading(false);
  },
  {
    enableHighAccuracy: false,
    timeout: 15000,
    maximumAge: 30000,
  }
);
  };

  /* ================= MAP EVENTS ================= */

  const onMapPress = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoord({ latitude, longitude });
    fetchAddress(latitude, longitude);
  };

  const onMarkerDragEnd = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoord({ latitude, longitude });
    fetchAddress(latitude, longitude);
  };



 /* ================= REVERSE GEOCODE ================= */

const fetchAddress = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'YourAppName/1.0 (contact@yourapp.com)', // Replace with your app details
        'Referer': 'https://yourapp.com',
        'Accept': 'application/json',
      },
    });

    // Check if response is ok and content-type is JSON
    if (!response.ok) {
      const text = await response.text();
      console.log('HTTP Error:', response.status, text.substring(0, 200));
      return;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('Non-JSON response:', text.substring(0, 200));
      return;
    }

    const data = await response.json();
    
    if (!data?.address) {
      console.log('No address data:', data);
      return;
    }

    const a = data.address;

    setAddress(prev => {
      const updated = {
        ...prev,
        addressLine1: data.display_name || a.road || a.house_number || '',
        city: a.city || a.town || a.village || a.municipality || '',
        district: a.state_district || a.county || '',
        state: a.state || '',
        country: a.country || 'India',
        pincode: a.postcode || '',
        latitude: lat,
        longitude: lng,
      };
      console.log('Updated address:', updated);
      return updated;
    });

  } catch (e) {
    console.log('Reverse geocode error:', e);
  }
};


  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const {
      addressLine1,
      addressLine2,
      city,
      district,
      state,
      country,
      pincode,
      latitude,
      longitude,
      addressType,
      landmark,
      mobileNum
    } = address;

    if (!latitude || !longitude || !addressLine1) return;

    const res = await addAddress(
      addressLine1,
      
      addressLine2,
      city,
      district,
      state,
      country,
      pincode,
      latitude,
      longitude,
      addressType,
      mobileNum,
      landmark,
    );

    if (res?.success) navigation.goBack();
  };

  /* ================= UI ================= */

  if (loading || !initialRegion) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EE4D2D" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <StatusBar barStyle="dark-content" />

      {/* MAP */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          mapType="hybrid"
          onPress={onMapPress}
        >
          {markerCoord && (
            <Marker
              coordinate={markerCoord}
              draggable
              onDragEnd={onMarkerDragEnd}
            >
              <View style={styles.marker}>
                <MapPinHouse size={35} color="#000" fill={"red"}/>
              </View>
            </Marker>
          )}
        </MapView>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} />
        </TouchableOpacity>
      </View>

      {/* FORM */}
      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Add delivery address</Text>

          <FullInput
            label="Address Line 1"
            value={address.addressLine1}
            onChange={t => setAddress({ ...address, addressLine1: t })}
          />

          <FullInput
            label="Address Line 2"
            value={address.addressLine2}
            onChange={t => setAddress({ ...address, addressLine2: t })}
          />

          <Row>
            <HalfInput
              label="Landmark"
              value={address.landmark}
              onChange={t => setAddress({ ...address, landmark: t })}
            />
            <HalfInput
              label="City"
              value={address.city}
              onChange={t => setAddress({ ...address, city: t })}
            />
          </Row>

          <FullInput
            label="Mobile Number"
            value={address.mobileNum}
            onChange={t => setAddress({ ...address, mobileNum : t })}
          />


          <Row>
            <HalfInput
              label="Pincode"
              value={address.pincode}
              onChange={t => setAddress({ ...address, pincode: t })}
            />
            <HalfInput
              label="District"
              value={address.district}
              onChange={t => setAddress({ ...address, district: t })}
            />
          </Row>

          <Row>
            <HalfInput
              label="State"
              value={address.state}
              onChange={t => setAddress({ ...address, state: t })}
            />
            <HalfInput
              label="Country"
              value={address.country}
              onChange={t => setAddress({ ...address, country: t })}
            />
          </Row>

          <Text style={styles.label}>Address Type</Text>
          <View style={styles.typeRow}>
            {[
              { key: 'home', icon: Home },
              { key: 'work', icon: Briefcase },
              { key: 'others', icon: MapPin },
            ].map(({ key, icon: Icon }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.typeCard,
                  address.addressType === key && styles.typeActive,
                ]}
                onPress={() => setAddress({ ...address, addressType: key })}
              >
                <Icon size={18} />
                <Text style={styles.typeText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Save Address</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LiveLocationMapScreen;

/* ================= REUSABLE INPUTS ================= */

const FullInput = ({ label, value, onChange }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} value={value} onChangeText={onChange} />
  </View>
);

const HalfInput = ({ label, value, onChange }) => (
  <View style={{ flex: 1 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} value={value} onChangeText={onChange} />
  </View>
);

const Row = ({ children }) => (
  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
    {children}
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  mapContainer: { flex: 0.6 },

  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },

  marker: {
    padding: 5,
  },

  sheet: {
    flex: 0.7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    marginBottom: 0,
    elevation: 10,
  },

  title: { fontSize: 22, fontWeight: '800', marginBottom: 14 },

  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },

  input: {
    backgroundColor: '#F5F6F8',
    borderRadius: 14,
    padding: 14,
    color: '#000',
    fontSize: 15,
  },

  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  typeCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
  },

  typeActive: {
    backgroundColor: '#FFF2EE',
    borderWidth: 1,
    borderColor: '#EE4D2D',
  },

  typeText: { marginTop: 6, textTransform: 'capitalize', fontWeight: '600' },

  submitBtn: {
    backgroundColor: '#EE4D2D',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 20,
  },

  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
