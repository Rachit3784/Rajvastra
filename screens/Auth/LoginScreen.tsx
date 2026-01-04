// screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import userStore from '../../store/MyStore';
import { Mail, Lock } from 'lucide-react-native';

// Premium Color Palette (same as Signup)
const COLORS = {
  primary: '#007AFF',
  textDark: '#000000',
  textMedium: '#8E8E93',
  textLight: '#C7C7CC',
  border: '#E5E5EA',
  borderFocus: '#007AFF',
  error: '#FF3B30',
  errorLight: '#FFEBEA',
  white: '#FFFFFF',
};

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

/* ==================== FLOATING INPUT (PERFECT & CRASH-FREE) ==================== */
const FloatingInput = ({
  label,
  value,
  onChangeText,
  error,
  secure = false,
  keyboardType = 'default',
  icon: Icon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { translateX: -8 * (1 - scale.value) },
    ],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  useEffect(() => {
    const shouldFloat = isFocused || !!value;
    translateY.value = withSpring(shouldFloat ? -28 : 0, { damping: 15, stiffness: 150 });
    scale.value = withSpring(shouldFloat ? 0.75 : 1, { damping: 15, stiffness: 150 });
  }, [isFocused, value]);

  useEffect(() => {
    if (error) {
      shake.value = withSequence(
        withTiming(-10, { duration: 80 }),
        withTiming(10, { duration: 80 }),
        withTiming(-10, { duration: 80 }),
        withTiming(10, { duration: 80 }),
        withTiming(0, { duration: 80 })
      );
    }
  }, [error]);

  const borderColor = error ? COLORS.error : isFocused ? COLORS.borderFocus : COLORS.border;
  const bgColor = error ? COLORS.errorLight : COLORS.white;

  return (
    <Animated.View style={[styles.inputContainer, animatedContainerStyle]}>
      <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
        <Text
          style={[
            styles.label,
            {
              color: error
                ? COLORS.error
                : isFocused || value
                ? COLORS.primary
                : COLORS.textMedium,
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: bgColor,
            borderWidth: isFocused ? 2 : 1.5,
          },
        ]}
      >
        {Icon && (
          <Icon
            size={20}
            color={error ? COLORS.error : isFocused ? COLORS.primary : COLORS.textMedium}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={COLORS.textLight}
          style={styles.textInput}
          {...props}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Warning: {error}</Text>
        </View>
      )}
    </Animated.View>
  );
};

/* ==================== LOGIN SCREEN ==================== */
export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = userStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login({
        email: form.email.trim(),
        password: form.password,
      });
      if (result.success) {
        navigation.replace('Interest');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue your journey</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FloatingInput
              label="Email Address"
              value={form.email}
              onChangeText={text => handleChange('email', text)}
              error={errors.email}
              keyboardType="email-address"
              icon={Mail}
            />

            <FloatingInput
              label="Password"
              value={form.password}
              onChangeText={text => handleChange('password', text)}
              error={errors.password}
              secure
              icon={Lock}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotLink}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.loginBtnText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupBold}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent : 'center',
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMedium,
    marginTop: 8,
    lineHeight: 22,
  },
  form: {
    marginTop: SPACING.sm,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    left: 12,
    top: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 6,
    marginLeft: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: COLORS.textDark,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  signupText: {
    color: COLORS.textMedium,
    fontSize: 15,
  },
  signupBold: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});