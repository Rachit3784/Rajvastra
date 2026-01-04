import {
  View,
  Text,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
  Keyboard,
} from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import userStore from '../../../store/MyStore'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('screen')

/* =======================
   DEBOUNCE FUNCTION
======================= */
const debounce = (func, delay) => {
  let timeoutId
  return (text) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(text), delay)
  }
}

const SearchProductScreen = () => {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const { fetchSearchedProduct } = userStore()
  const navigation = useNavigation()

  /* =======================
     FETCH SUGGESTIONS
  ======================== */
  const fetchSuggestions = useCallback(async (text) => {
    if (!text.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetchSearchedProduct(text, 1, 5)
      if (response?.success) setSuggestions(response.products)
      else setSuggestions([])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedSearch = useMemo(
    () => debounce(fetchSuggestions, 500),
    [fetchSuggestions]
  )

  const handleSearch = (text) => {
    setQuery(text)
    debouncedSearch(text)
  }

  /* =======================
     ON ENTER KEY / SUBMIT
  ======================== */
  const handleSubmit = () => {
    if (query.trim()) {
      Keyboard.dismiss()
      navigation.navigate('SearchResultScreen', { text: query.trim() })
    }
  }

  /* =======================
     RENDER SUGGESTION ITEM
  ======================== */
  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('ProductDetail', {
          productId: item?.Parent,
          varientId: item?._id,
        })
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 0.7,
        borderBottomColor: '#e0e0e0',
      }}
    >
      {/* LEFT: PRODUCT NAME */}
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }} numberOfLines={2}>
          {item?.ProductName}
        </Text>
        <Text style={{ fontSize: 13, color: '#777', marginTop: 4 }}>
          ⭐ {item?.rating || '4.0'}
        </Text>
      </View>

      {/* RIGHT: IMAGE */}
      <Image
        source={{ uri: item?.coverImage }}
        style={{ width: 46, height: 46, borderRadius: 6, backgroundColor: '#f2f2f2' }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ================= HEADER ================= */}
      <View
        style={{
          paddingTop: StatusBar.currentHeight + 14,
          paddingBottom: 14,
          backgroundColor: '#FFD700',
          alignItems: 'center',
          elevation: 5,
        }}
      >
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search products"
          placeholderTextColor="#888"
          style={{
            width: width * 0.92,
            backgroundColor: '#fff',
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: '#000',
            elevation: 2,
          }}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
        />
      </View>

      {/* ================= LOADER ================= */}
      {loading && (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="#000"
        />
      )}

      {/* ================= SUGGESTIONS LIST ================= */}
      {!loading && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item?._id}
          renderItem={renderSuggestion}
          ListEmptyComponent={
            query && !loading ? (
              <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16, color: '#777' }}>
                No products found
              </Text>
            ) : null
          }
        />
      )}
    </View>
  )
}

export default SearchProductScreen
