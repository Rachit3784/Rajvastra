
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import userStore from '../../store/MyStore';

const { width } = Dimensions.get('window');

const CountdownTimer = ({ start = 59, onComplete }) => {
  const [time, setTime] = useState(start);

  useEffect(() => {
    if (time === 0) {
      onComplete?.();
      return;
    }
    const id = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [time]);

  return (
    <Text style={{ color: '#666', fontSize: 16, textAlign: 'center', marginTop: 20 }}>
      Resend in{' '}
      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>{time}s</Text>
    </Text>
  );
};

export default function OtpScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const params = route.params || {};
  const { email, username, fullname, password, gender, type = 'Signup' } = params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputs = useRef([]);

  const { verifyNewUser, createUser, verifyForgottedUser, forgetPasswordRequest } = userStore();
  const isForgetFlow = (type || '').toLowerCase().includes('forget');

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setError('');

    try {
      let res;
      if (isForgetFlow) {
        res = await verifyForgottedUser({ email, code });
      } else {
        res = await verifyNewUser({ email, password, code });
      }

      if (res?.success) {
        if (isForgetFlow) {
          navigation.replace('ResetPassword', { email });
        } else {
          navigation.replace('Interest', { email, isNewUser: 'yes' });
        }
      } else {
        setError(res?.message || 'Invalid OTP');
      }
    } catch {
      setError('Verification failed');
    }
  };

  const handleResend = async () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    setIsResendDisabled(true);
    inputs.current[0]?.focus();

    try {
      if (isForgetFlow) {
        await forgetPasswordRequest(email);
      } else {
        await createUser({ email, username, fullname, password, gender });
      }
      Alert.alert('Sent!', 'New OTP sent to your email');
    } catch {
      Alert.alert('Error', 'Failed to resend');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 15,
              borderWidth : 1,
              borderColor : '#000000ff',
              width: width*0.93,
              alignSelf: 'center',
              
            }}
          >
            {/* Header */}
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#000', marginBottom: 8 }}>
              Verify Email
            </Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
              We sent a 6-digit code to
            </Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 40 }}>
              {email}
            </Text>

            {/* 6 OTP Boxes – Now Perfectly Fit */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between',  width: width*0.9  }}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputs.current[index] = ref)}
                  value={digit}
                  onChangeText={text => handleChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={{
                    width: 48,
                    height: 48,
                    
          
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: digit ? '#007AFF' : '#ddd',
                    backgroundColor: '#f9f9f9',
                    color: '#000',
                    fontSize: 20,
                    fontWeight: 'semibold',
                    textAlign: 'center',
                    
                  }}
                />
              ))}
            </View>

            {/* Error */}
            {error ? (
              <Text style={{ color: '#FF3B30', fontSize: 15, marginTop: 20, textAlign: 'center' }}>
                {error}
              </Text>
            ) : null}

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerify}
              style={{
                backgroundColor: '#000',
                width: '100%',
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
                marginTop: 30,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                Verify & Continue
              </Text>
            </TouchableOpacity>

            {/* Resend */}
            {isResendDisabled ? (
              <CountdownTimer onComplete={() => setIsResendDisabled(false)} />
            ) : (
              <TouchableOpacity onPress={handleResend} style={{ marginTop: 20 }}>
                <Text style={{ color: '#007AFF', fontSize: 17, fontWeight: 'bold' }}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}