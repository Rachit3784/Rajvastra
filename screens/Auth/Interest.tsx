// screens/auth/InterestsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import userStore from '../../store/MyStore';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InterestsScreen() {
  const navigation = useNavigation();
  const { updateUserProfile, userModelID } = userStore();
  const [keywords, setKeywords] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
const insets = useSafeAreaInsets()
  const handleSave = async () => {
    console.log(userModelID)
    setLoading(true);

    const res = await updateUserProfile({
      UserKeyWords: keywords.split(',').map(k => k.trim()),
      UserDescription: desc,
      userId: userModelID

    });
    setLoading(false);
    if (res.success) {
      navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top , paddingHorizontal : 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 30 }}>Complete Profile</Text>

      <TextInput
        placeholder="Keywords (Engineer, Designer, etc.)"
        value={keywords}
        onChangeText={setKeywords}
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, marginBottom: 20 }}
      />

      <TextInput
        placeholder="Short bio..."
        value={desc}
        onChangeText={setDesc}
        multiline
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, height: 120, textAlignVertical: 'top' }}
      />

      <TouchableOpacity
        onPress={handleSave}
        style={{ backgroundColor: '#000', padding: 18, borderRadius: 12, marginTop: 30 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}>Save & Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.replace('Main')}
        style={{ marginTop: 20, alignItems: 'center' }}
      >
        <Text style={{ color: '#666', fontWeight: 'bold' }}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}