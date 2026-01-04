import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import userStore from '../../../store/MyStore'
import { ChevronLeft, Search, ShoppingBag } from 'lucide-react-native'
import { Star } from 'lucide-react-native'

const { width } = Dimensions.get('screen')

const SearchResultScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { text } = route.params

  const { fetchSearchedProduct } = userStore()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  /* =======================
     FETCH PRODUCTS
  ======================== */
  const fetchProducts = useCallback(
    async (currentPage = 1) => {
      if (!text.trim()) return
      if (currentPage === 1) setLoading(true)
      else setIsFetchingMore(true)

      try {
        const response = await fetchSearchedProduct(text, currentPage, 10)
        if (response?.success) {
          if (currentPage === 1) setProducts(response.products)
          else setProducts((prev) => [...prev, ...response.products])
          setHasMore(response.products.length === 10)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
        setIsFetchingMore(false)
      }
    },
    [text]
  )

  useEffect(() => {
    fetchProducts(1)
  }, [text])

  /* =======================
     HANDLE LOAD MORE
  ======================== */
  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage)
    }
  }

  /* =======================
     PRODUCT CARD
  ======================== */
  const ProductCard = ({ product }) => {
    const priceData = product.pricing[0] || {}
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            productId: product.Parent,
            varientId: product._id,
          })
        }
        style={{
          width: width * 0.5 - 20,
          marginHorizontal:  8,
          
          borderRadius: 8,
          overflow: 'hidden',
          
        }}
      >
        {/* IMAGE */}
        <View style={{ height: 190, overflow: 'hidden', borderRadius: 10 }}>
          <Image
            source={{ uri: product.coverImage }}
            resizeMode="cover"
            style={{ width: '100%', height: '100%' }}
          />
          {/* DISCOUNT */}
          {priceData.discountPercentage ? (
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
                {priceData.discountPercentage}% OFF
              </Text>
            </View>
          ) : null}
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
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#111',
                  letterSpacing: -0.3,
                }}
              >
                ₹{priceData.discountedPrice || priceData.actualMRP}
              </Text>
              {priceData.discountedPrice && priceData.discountedPrice !== priceData.actualMRP && (
                <Text
                  style={{
                    fontSize: 11,
                    color: '#9a9a9a',
                    textDecorationLine: 'line-through',
                  }}
                >
                  ₹{priceData.actualMRP}
                </Text>
              )}
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
                {product.rating || '4.0'}
              </Text>
            </View>
          </View>

          {/* PRODUCT NAME */}
          <Text
            numberOfLines={2}
            style={{
              fontSize: 11,
              fontWeight: '400',
              color: '#1a1a1a',
              lineHeight: 16,
            }}
          >
            {product.ProductName}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ================= HEADER ================= */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: StatusBar.currentHeight + 12,
          paddingBottom: 12,
          paddingHorizontal: 15,
          height : 90,
          backgroundColor: '#FFD700',
          elevation: 5,
        }}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#000' }}>
          Search Results
        </Text>

        {/* Search + Cart buttons */}
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <TouchableOpacity onPress={() => {}}>
            <Search size={19} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <ShoppingBag size={19} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= PRODUCT LIST ================= */}
      {loading && page === 1 ? (
        <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#000" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ProductCard product={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          numColumns={2}
          style = {{marginTop : 10}}
          contentContainerStyle = {{gap : 10 , alignItems : 'center' }}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator style={{ marginVertical: 12 }} color="#000" /> : null
          }
          ListEmptyComponent={
            !loading ? (
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

export default SearchResultScreen
