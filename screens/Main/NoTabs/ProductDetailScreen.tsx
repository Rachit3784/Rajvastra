import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Easing ,
  RefreshControl,
  Animated,
  ActivityIndicator,
} from 'react-native';

import {
  Box,
  StarHalf,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleUser,
  Heart,
  IndianRupee,
  List,
  Share2,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Video,
  Play,
  ThumbsUp,
} from 'lucide-react-native';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation, useRoute } from '@react-navigation/native';
import userStore from '../../../store/MyStore';

const { width, height } = Dimensions.get('screen');

const SkeletonBox = ({ w, h, r = 6, style }) => (
  <View
    style={{
      width: w,
      height: h,
      borderRadius: r,
      backgroundColor: '#e5e7eb',
      overflow: 'hidden',
      ...(style || {}),
    }}
  />
);

const ProductDetailSkeleton = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      
      {/* Image slider skeleton */}
      <SkeletonBox w={width} h={320} r={0} />

      {/* Content */}
      <View style={{ padding: 14 }}>
        
        {/* Product title */}
        <SkeletonBox w="80%" h={18} style={{ marginBottom: 8 }} />
        <SkeletonBox w="60%" h={18} />

        {/* Rating */}
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <SkeletonBox w={70} h={16} r={4} />
        </View>

        {/* Price */}
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <SkeletonBox w={110} h={22} />
          <SkeletonBox w={60} h={18} style={{ marginLeft: 10 }} />
        </View>

        {/* Variants */}
        <View style={{ marginTop: 20 }}>
          <SkeletonBox w={140} h={14} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            {[1, 2, 3, 4].map(i => (
              <SkeletonBox
                key={i}
                w={70}
                h={90}
                r={10}
                style={{ marginRight: 10 }}
              />
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={{ marginTop: 24 }}>
          <SkeletonBox w="90%" h={14} style={{ marginBottom: 6 }} />
          <SkeletonBox w="95%" h={14} style={{ marginBottom: 6 }} />
          <SkeletonBox w="85%" h={14} />
        </View>

      </View>

      {/* Bottom CTA skeleton */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderColor: '#e5e7eb',
        }}
      >
        <SkeletonBox w="45%" h={44} r={8} />
        <SkeletonBox w="45%" h={44} r={8} />
      </View>

    </View>
  );
};




const CollapsableHeader = ({ navigation }) => {
  return (
    <View
      style={{
        width,
        height: 85,
        paddingTop: 35,
        paddingHorizontal: 14,
        backgroundColor: '#fde800ff',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          style={{
            width: 35,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={21} color="#111827" />
        </TouchableOpacity>

        {/* Right: Actions */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              width: 35,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Share2 size={20} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              width: 35,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Heart size={20} color="#ff6310ff" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              width: 35,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={20} color="#1d4ed8" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ProductImageSlider = ({ images = [], rating, totalSoldOut }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomVisible, setIsZoomVisible] = useState(false);

  const flatListRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const zoomImages = images.map(img => ({ url: img }));

  if (!images.length) return null;

  return (
    <View style={{ backgroundColor: '#fff', position: 'relative' }}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => setIsZoomVisible(true)}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* Page indicator pill */}
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: 'rgba(17,24,39,0.7)',
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: '#f9fafb',
            fontWeight: '600',
          }}
        >
          {activeIndex + 1} / {images.length}
        </Text>
      </View>

      {/* Dots */}
      <View
        style={{
          ...styles.dotsContainer,
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
        }}
      >
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: activeIndex === index ? 14 : 6,
                borderRadius: 999,
                backgroundColor:
                  activeIndex === index ? '#fbbf24' : 'rgba(229,231,235,0.7)',
              },
            ]}
          />
        ))}
      </View>

      {/* Zoom modal */}
      <Modal
        isVisible={isZoomVisible}
        style={{ margin: 0, backgroundColor: '#000' }}
        onBackdropPress={() => setIsZoomVisible(false)}
        onBackButtonPress={() => setIsZoomVisible(false)}
      >
        <ImageViewer
          imageUrls={zoomImages}
          index={activeIndex}
          enableSwipeDown
          onSwipeDown={() => setIsZoomVisible(false)}
          backgroundColor="#000"
          enablePreload
        />
      </Modal>

      {/* Rating & sold strip */}
      <View
        style={{
          position: 'absolute',
          bottom: 18,
          left: 16,
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Rating */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjwo984WuxZzFZG_DMJhBWgOmvqiyiqr7HBw&s',
            }}
            style={{ width: 12, height: 12 }}
          />
        </View>

        <View
          style={{
            width: 1,
            height: 14,
            backgroundColor: 'rgba(156,163,175,0.7)',
          }}
        />

        {/* Sold count */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <CircleUser size={14} color="#e5e7eb" />
          <Text
            style={{
              fontSize: 12,
              color: '#e5e7eb',
              fontWeight: '500',
            }}
          >
            {totalSoldOut} sold
          </Text>
        </View>
      </View>
    </View>
  );
};

// ================= RATING STARS =================
const RatingStars = ({ rating, size = 18, color = '#ff7300ff' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} size={size} color={color} fill={color} />
      ))}

      {halfStar && (
        <View style={{ width: size, height: size }}>
          <Star
            size={size}
            color={color}
            fill="none"
            style={StyleSheet.absoluteFill}
          />
          <StarHalf
            size={size}
            color={color}
            fill={color}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          size={size}
          color={color}
          fill="none"
        />
      ))}
    </View>
  );
};

// ================= RATING SECTION =================

const RatingOrRateButton = ({ 
  variant, 
  Product, 
  navigation, 
  productId, 
  varientId, 
  width 
}) => {
  const hasNoRatingData = 
    !variant?.ratingMap?.length && 
    !variant?.rating && 
    !Product?.TotalReviews && 
    !Product?.OverAllRatingMap?.length;

  if (hasNoRatingData) {
    return (
      <RateButton 
        navigation={navigation}
        productId={variant?.Parent || productId}
        variantId={variant?.id || varientId}
        width={width}
      />
    );
  }

  return (
    <RatingSection
      RatingMap={variant?.ratingMap || []}
      VarientRating={variant?.rating}
      OverallRating={Product?.TotalReviews}
      OverAllRatingMap={Product?.OverAllRatingMap || []}
    />
  );
};

// Separate RateButton component
const RateButton = ({ navigation, productId, variantId, width }) => (
  <View style={{ paddingVertical: 1, backgroundColor: '#ffffffff', width, alignItems: 'center' }}>
    <View style={{ width: width * 0.89, paddingVertical: 14 }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: '#2563eb',
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
        onPress={() => {
          navigation.navigate('RateProduct', { 
            productId, 
            variantId 
          });
        }}
      >
        <Star size={20} color="#fff" fill="#fbbf24" />
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
          Be the first to rate
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);



const RatingSection = ({
  RatingMap = [],
  VarientRating,
  OverallRating,
  OverAllRatingMap = [],
}) => {
  const [ratingStatus, setRatingStatus] = useState('Varient');
   console.log(RatingMap)
  const colorArray = ['#22c55e', '#4ade80', '#facc15', '#fb923c', '#f97373'];

  const ratingBarArray = RatingMap.map((item, index) => ({
    ...item,
    color: colorArray[index] ?? colorArray[colorArray.length - 1],
  }));

  const overAllRatingMapArray = OverAllRatingMap.map((item, index) => ({
    ...item,
    color: colorArray[index] ?? colorArray[colorArray.length - 1],
  }));

  const activeRatingBars =
    ratingStatus === 'Varient' ? ratingBarArray : overAllRatingMapArray;

  const activeRating =
    ratingStatus === 'Varient' ? VarientRating : OverallRating;

  return (
    <View
      style={{
        paddingVertical: 1,
        backgroundColor: '#ffffffff',
        width,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: width * 0.89,
          paddingVertical: 14,
        }}
      >
        {/* Header + Toggle */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#111827',
              }}
            >
              Ratings & Reviews
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
                marginTop: 2,
              }}
            >
              See what people think
            </Text>
          </View>

          {/* Toggle pill */}
          <View
            style={{
              borderRadius: 999,
              flexDirection: 'row',
              padding: 3,
              backgroundColor: '#e5e7eb',
            }}
          >
            <TouchableOpacity
              onPress={() => setRatingStatus('Varient')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor:
                  ratingStatus === 'Varient' ? '#fff' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color:
                    ratingStatus === 'Varient' ? '#111827' : '#6b7280',
                }}
              >
                Variant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRatingStatus('Overall')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor:
                  ratingStatus === 'Overall' ? '#fff' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color:
                    ratingStatus === 'Overall' ? '#111827' : '#6b7280',
                }}
              >
                Overall
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main content */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left – big rating */}
          <View
            style={{
              width: '40%',
              alignItems: 'center',
              paddingRight: 10,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '800',
                  color: '#111827',
                }}
              >
                {activeRating?.toFixed ? activeRating.toFixed(1) : activeRating}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginLeft: 2,
                  marginBottom: 4,
                }}
              >
                /5
              </Text>
            </View>

            <View style={{ marginTop: 4 }}>
              <RatingStars rating={activeRating} size={18} />
            </View>

            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
                marginTop: 4,
              }}
            >
              428 ratings · 86 reviews
            </Text>
          </View>

          {/* Right – distribution bars */}
          <View style={{ width: '55%', marginTop: 3 }}>
            {activeRatingBars.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 3,
                }}
              >
                {/* Star label */}
                <View
                  style={{
                    width: 32,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      color: '#9ca3af',
                      marginLeft: 1,
                    }}
                  >
                    ★
                  </Text>
                </View>

                {/* Bar */}
                <View
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: '#e5e7eb',
                    overflow: 'hidden',
                    marginHorizontal: 6,
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${Number(item.subtitle)}%`,
                      backgroundColor: item.color,
                      borderRadius: 999,
                    }}
                  />
                </View>

                {/* Count */}
                <Text
                  style={{
                    fontSize: 10,
                    color: '#6b7280',
                    minWidth: 40,
                    textAlign: 'right',
                  }}
                >
                  {item.people}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};


const QuantitySelector = ({
  quantity = 1,
  setQuantity,
  min = 1,
  max = 99,
}) => {
  const increase = () => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  };

  const decrease = () => {
    if (quantity > min) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.Quantitycontainer}>
      <TouchableOpacity onPress={decrease} style={styles.button}>
        <Text style={styles.text}>−</Text>
      </TouchableOpacity>

      <View style={styles.countBox}>
        <Text style={styles.count}>{quantity}</Text>
      </View>

      <TouchableOpacity onPress={increase} style={styles.button}>
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
    </View>
  );
}






// ================= PRODUCT NAME =================
const ProductName = ({ data  , quantity , setQuantity , handleWishList , wishList}) => {
  // align with what ProductDetailScreen passes (price object)
  const PriceObject = data.price;

  return (
    <View
      style={{
        width,
        backgroundColor: '#ffffffd3',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: width * 0.94,
          borderRadius: 10,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        {/* LEFT CONTENT */}
        <View style={{ flex: 1, gap: 6, paddingRight: 10 }}>
          {/* Brand */}
          <Text
            style={{
              color: '#6b7280',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontWeight: '600',
            }}
          >
            {data.brand}
          </Text>

          {/* Name */}
          <Text
            style={{
              color: '#111827',
              fontSize: 16,
              fontWeight: '700',
            }}
            numberOfLines={2}
          >
            {data.name}
          </Text>

          {/* PRICE ROW */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 8,
              marginTop: 6,
            }}
          >
            {/* Current price */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <IndianRupee size={18} color="#111827" />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#111827',
                  marginLeft: 1,
                }}
              >
                {PriceObject?.discountedPrice}
              </Text>
            </View>

            {/* MRP */}
            {PriceObject?.actualMRP && (
              <Text
                style={{
                  fontSize: 16,
                  color: '#858c98ff',
                  textDecorationLine: 'line-through',
                }}
              >
                {PriceObject?.actualMRP}
              </Text>
            )}

            {/* Discount pill */}
            {PriceObject?.discountPercentage ? (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: '#ecfdf5',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#16a34a',
                  }}
                >
                  {PriceObject.discountPercentage}% OFF
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
             width,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            
              justifyContent : 'space-between',
              marginTop: 6,
            }}
          >
          <Text>
           Total available :  {PriceObject?.stock}
          </Text>


         <View style = {{paddingRight : 3 , width : width*0.38}}>
           <QuantitySelector quantity={quantity} setQuantity={setQuantity} min={1} max={PriceObject.stock}/>
         </View>

          </View>


          <Text
            style={{
              fontSize: 11,
              color: '#6b7280',
              marginTop: 4,
            }}
          >
            Inclusive of all taxes
          </Text>
        </View>

        {/* RIGHT ICONS */}
        <View
          style={{
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <TouchableOpacity

          onPress={handleWishList}
            activeOpacity={0.85}
            style={{
              borderRadius: 999,
              backgroundColor: '#f9fafb',
              width: 34,
              height: 34,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Heart size={20} color="#111827"  fill={wishList ? 'red' : 'transparent'}/>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              borderRadius: 999,
              backgroundColor: '#eff6ff',
              width: 34,
              height: 34,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#bfdbfe',
            }}
          >
            <Play color="#1d4ed8" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ================= VARIANT SECTION =================
// updated to match the way ProductDetailScreen uses it
const ProductVarient = ({
  variants,
  selectedVariantId,
  onVariantSelect,
}) => {
  if (!variants?.length) return null;
  
  const selectedVariant = variants.find(v => v._id === selectedVariantId);

  return (
    <View
      style={{
        width,
        backgroundColor: '#ffffffff',
        marginVertical: 2,
        alignItems: 'center',
        paddingVertical: 2,
      }}
    >
      <View
        style={{
          width: width * 0.94,
          borderRadius: 10,
          paddingVertical: 12,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#111827',
              }}
            >
              Choose variant
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
                marginTop: 2,
              }}
            >
              Swipe to see all designs
            </Text>
          </View>

          {selectedVariant?.ProductName && (
            <Text
              numberOfLines={1}
              style={{
                maxWidth: '50%',
                fontSize: 11,
                color: '#4b5563',
                textAlign: 'right',
              }}
            >
              Selected:{' '}
              <Text style={{ fontWeight: '600' }}>
                {selectedVariant.ProductName}
              </Text>
            </Text>
          )}
        </View>

        {/* Variant thumbnails */}
        <FlatList
          data={variants}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={{ paddingVertical: 4 }}
          renderItem={({ item }) => {
            const isSelected = item._id === selectedVariantId;

            return (
              <TouchableOpacity
                onPress={() => onVariantSelect(item._id)}
                activeOpacity={0.9}
                style={{
                  marginRight: 10,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    borderRadius: 12,
                    width: 78,
                    height: 90,
                    padding: 3,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? '#2563eb' : '#e5e7eb',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    justifyContent: 'center',
                    shadowColor: isSelected ? '#2563eb' : 'transparent',
                    shadowOpacity: isSelected ? 0.25 : 0,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: isSelected ? 2 : 0,
                  }}
                >
                  <Image
                    source={{ uri: item.coverImage }}
                    style={{
                      width: '100%',
                      height: '72%',
                      borderRadius: 8,
                      backgroundColor: '#f3f4f6',
                    }}
                    resizeMode="cover"
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 10,
                      marginTop: 3,
                      textAlign: 'center',
                      color: isSelected ? '#1d4ed8' : '#4b5563',
                      fontWeight: isSelected ? '600' : '500',
                    }}
                  >
                    {item.ProductName || 'Variant'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        
      </View>
    </View>
  );
};

// ================= SIZE SECTION =================
// updated to match ProductDetailScreen props
const SizeSection = ({
  sizeScale,
  selectedSize,
  onSizeChange,
}) => {
  if (!sizeScale?.length) return null;

  return (
    <View
      style={{
        width,
        backgroundColor: '#ffffffff',
        marginVertical: 2,
        alignItems: 'center',
        paddingVertical: 2,
      }}
    >
      <View
        style={{
          width: width * 0.94,
          paddingVertical: 12,
        }}
      >
        {/* Header + helper text */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#111827',
              }}
            >
              Select size
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
                marginTop: 2,
              }}
            >
              Tap to choose your best fit
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              backgroundColor: '#f9fafb',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: '#2563eb',
                fontWeight: '600',
              }}
            >
              Size guide
            </Text>
          </TouchableOpacity>
        </View>

        {/* Size pills */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 6,
          }}
        >
          {sizeScale.map((item, index) => {
            const isSelected = selectedSize === item;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSizeChange(item)}
                activeOpacity={0.85}
                style={{
                  minWidth: 46,
                  height: 40,
                  paddingHorizontal: 10,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: isSelected ? '#2563eb' : '#d1d5db',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: isSelected ? '#1d4ed8' : '#111827',
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected size info */}
        {selectedSize && (
          <Text
            style={{
              fontSize: 11,
              color: '#6b7280',
              marginTop: 8,
            }}
          >
            Selected size:{' '}
            <Text style={{ fontWeight: '600', color: '#111827' }}>
              {selectedSize}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

// ================= OFFER SECTION =================
const CARDWIDTH = width * 0.9;
const CARDHEIGHT = height * 0.23;
const CARDSPACING = 16;

const OfferSection = ({ offers, SelectedOffer, setSelectedOffer }) => {
  if (!offers?.length) return null;

  return (
    <View style={{ backgroundColor: '#ffffffff', width, marginBottom: 1, paddingVertical: 16 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginHorizontal: 10, marginBottom: 10 }}>
        Crazy deals for you
      </Text>
      <FlatList
        data={offers}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARDWIDTH + CARDSPACING}
        decelerationRate="fast"
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `offer-${index}`)} // ✅ Fixed: Safe keyExtractor
        contentContainerStyle={{ paddingLeft: 10 }}
        renderItem={({ item, index }) => { // ✅ Fixed: Destructure with index fallback
          const isApplied = SelectedOffer === (item.id || index);
          return (
            <View style={{ marginRight: CARDSPACING }}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  width: CARDWIDTH,
                  height: CARDHEIGHT,
                  borderRadius: 16,
                  backgroundColor: '#fff1f2',
                  padding: 16,
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: isApplied ? '#fb7185' : '#ffe4e6',
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                {/* Top content */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    {/* Label pill */}
                    <View style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 999,
                      backgroundColor: '#fee2e2',
                      marginBottom: 6,
                    }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase' }}>
                        Offer
                      </Text>
                    </View>
                    <Text numberOfLines={2} style={{ fontSize: 18, fontWeight: '900', color: '#111827' }}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text style={{ marginTop: 4, fontSize: 14, fontWeight: '700', color: '#be123c' }}>
                        {item.subtitle}
                      </Text>
                    )}
                    {item.description && (
                      <Text numberOfLines={2} style={{ marginTop: 6, fontSize: 12, color: '#4b5563' }}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                  {item.offerimage && (
                    <Image
                      source={{ uri: item.offerimage }}
                      resizeMode="contain"
                      style={{ width: 80, height: 80, marginLeft: 10 }}
                    />
                  )}
                </View>

                {/* CTA */}
                {isApplied ? (
                  <TouchableOpacity
                    onPress={() => setSelectedOffer(null)}
                    activeOpacity={0.8}
                    style={{
                      marginTop: 8,
                      backgroundColor: '#dcfce7',
                      paddingVertical: 9,
                      borderRadius: 999,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#166534' }}>Applied</Text>
                    <ThumbsUp size={18} color="#16a34a" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setSelectedOffer(item.id || index)}
                    activeOpacity={0.8}
                    style={{
                      marginTop: 8,
                      backgroundColor: '#fb7185',
                      paddingVertical: 9,
                      borderRadius: 999,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Grab deal</Text>
                    <ChevronRight size={17} color="#fff" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

// ================= ALL DETAIL =================
const AllDetail = ({ 
  ProductDescription = [], 
  ProductDetail = [], 
  ReturnPolicy = {} 
}) => {
  const [ProductDescriptionOpen, setProductDescriptionOpen] = useState(false);
  const [AllDetailOpen, setAllDetailOpen] = useState(false);

  // Check if sections have valid content
  const hasProductDescription = ProductDescription?.some(item => 
    item?.title || item?.subtitle
  );
  
  const hasProductDetail = ProductDetail?.some(item => 
    item?.title || item?.subtitle
  );

  const hasReturnPolicy = ReturnPolicy?.title || ReturnPolicy?.subtitle;

  // Skip accordions if no content
  if (!hasProductDescription && !hasProductDetail) {
    return (
      <View style={{ paddingVertical: 12, backgroundColor: '#ffffffff', width, alignItems: 'center' }}>
        <PolicyHeader ReturnPolicy={ReturnPolicy} />
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 12, backgroundColor: '#ffffffff', width, alignItems: 'center' }}>
      {/* Policy header + card */}
      <PolicyHeader ReturnPolicy={ReturnPolicy} />

      {/* Accordions container - only if content exists */}
      <View style={{ width: width * 0.9 }}>
        {/* All Details title & accordion - only if content */}
        {hasProductDetail && (
          <>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 6 }}>
              Product information
            </Text>
            {renderAllDetailsAccordion(hasProductDetail, AllDetailOpen, setAllDetailOpen, ProductDetail)}
          </>
        )}

        {/* Product Description accordion - only if content */}
        {hasProductDescription && (
          renderProductDescriptionAccordion(ProductDescriptionOpen, setProductDescriptionOpen, ProductDescription)
        )}
      </View>
    </View>
  );
};

// Policy Header Component
const PolicyHeader = ({ ReturnPolicy = {} }) => (
  <View style={{ width: width * 0.9, marginBottom: 8 }}>
    <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6 }}>
      Delivery & Policy
    </Text>
    <View style={{
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: '#ffffff',
      paddingHorizontal: 14,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    }}>
      {/* RETURN POLICY - only if has content */}
      {ReturnPolicy?.title && (
        <View style={{ alignItems: 'center', width: '32%'  }}>
          <View style={{
            width: 44, height: 44, borderRadius: 999,
            backgroundColor: '#fee2e2', alignItems: 'center',
            justifyContent: 'center', marginBottom: 6,
          }}>
            <Box size={22} color="#ef4444" />
          </View>
          <Text numberOfLines={2} style={{
            fontSize: 11, fontWeight: '600', color: '#111827',
            textAlign: 'center',
          }}>
            {ReturnPolicy.title}
          </Text>
          {ReturnPolicy.subtitle && (
            <Text numberOfLines={1} style={{
              fontSize: 10, color: '#6b7280', marginTop: 2,
            }}>
              {ReturnPolicy.subtitle}
            </Text>
          )}
        </View>
      )}

      {/* COD - always visible */}
      <View style={{ alignItems: 'center', width: '32%' }}>
        <View style={{
          width: 44, height: 44, borderRadius: 999,
          backgroundColor: '#dbeafe', alignItems: 'center',
          justifyContent: 'center', marginBottom: 6,
        }}>
          <Truck size={22} color="#2563eb" />
        </View>
        <Text numberOfLines={2} style={{
          fontSize: 11, fontWeight: '600', color: '#111827',
          textAlign: 'center',
        }}>
          Cash on Delivery
        </Text>
        <Text numberOfLines={1} style={{
          fontSize: 10, color: '#6b7280', marginTop: 2,
        }}>
          Available
        </Text>
      </View>

      {/* DIVIDER - only if ReturnPolicy exists */}
      {ReturnPolicy?.title && (
        <View style={{ width: 1, height: 42, backgroundColor: '#e5e7eb' }} />
      )}

      {/* TAG - always visible */}
      <View style={{ alignItems: 'center', width: '32%' }}>
        <View style={{
          width: 44, height: 44, borderRadius: 999,
          backgroundColor: '#dcfce7', alignItems: 'center',
          justifyContent: 'center', marginBottom: 6,
        }}>
          <Tag size={22} color="#16a34a" />
        </View>
        <Text numberOfLines={2} style={{
          fontSize: 11, fontWeight: '600', color: '#111827',
          textAlign: 'center',
        }}>
          Best Product
        </Text>
        <Text numberOfLines={1} style={{
          fontSize: 10, color: '#6b7280', marginTop: 2,
        }}>
          Quality assured
        </Text>
      </View>
    </View>
  </View>
);

// All Details Accordion
const renderAllDetailsAccordion = (hasContent, isOpen, setIsOpen, ProductDetail) => {
  return isOpen ? (
    <View style={{
      marginTop: 10, borderRadius: 14, borderWidth: 1,
      borderColor: '#e5e7eb', backgroundColor: '#ffffff', overflow: 'hidden',
    }}>
      <TouchableOpacity onPress={() => setIsOpen(false)} style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingVertical: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            height: 30, width: 30, borderRadius: 8, backgroundColor: '#eef2ff',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Shirt size={18} color="#4f46e5" />
          </View>
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 13, color: '#111827', fontWeight: '600' }}>
              All product details
            </Text>
            <Text style={{ fontSize: 11, color: '#6b7280' }}>
              Color, fit, fabric & more
            </Text>
          </View>
        </View>
        <ChevronUp size={18} color="#6b7280" />
      </TouchableOpacity>
      <View style={{ height: 1, backgroundColor: '#e5e7eb', marginHorizontal: 12 }} />
      <FlatList
        data={ProductDetail}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%', paddingVertical: 6, paddingHorizontal: 14 }}>
            {item?.title && (
              <Text style={{
                fontSize: 12, color: '#9ca3af', fontWeight: '500',
                textTransform: 'uppercase',
              }}>
                {item.title}
              </Text>
            )}
            {item?.subtitle && (
              <Text style={{
                fontSize: 13, color: '#111827', fontWeight: '500', marginTop: 2,
              }}>
                {item.subtitle}
              </Text>
            )}
            <View style={{ height: 1, backgroundColor: '#f3f4f6', marginTop: 8 }} />
          </View>
        )}
      />
    </View>
  ) : (
    <TouchableOpacity onPress={() => setIsOpen(true)} style={{
      marginTop: 10, flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', borderRadius: 14, borderWidth: 1,
      borderColor: '#e5e7eb', paddingHorizontal: 14, paddingVertical: 10,
      backgroundColor: '#ffffff',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{
          height: 30, width: 30, borderRadius: 8, backgroundColor: '#eef2ff',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Shirt size={18} color="#4f46e5" />
        </View>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 13, color: '#111827', fontWeight: '600' }}>
            All product details
          </Text>
          <Text style={{ fontSize: 11, color: '#6b7280' }}>
            Color, occasion & more
          </Text>
        </View>
      </View>
      <ChevronDown size={18} color="#6b7280" />
    </TouchableOpacity>
  );
};

// Product Description Accordion  
const renderProductDescriptionAccordion = (isOpen, setIsOpen, ProductDescription) => {
  return isOpen ? (
    <View style={{
      marginTop: 10, borderRadius: 14, borderWidth: 1,
      borderColor: '#e5e7eb', backgroundColor: '#ffffff', overflow: 'hidden',
    }}>
      <TouchableOpacity onPress={() => setIsOpen(false)} style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingVertical: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            height: 30, width: 30, borderRadius: 8, backgroundColor: '#fef3c7',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <List size={18} color="#d97706" />
          </View>
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 13, color: '#111827', fontWeight: '600' }}>
              Product description
            </Text>
            <Text style={{ fontSize: 11, color: '#6b7280' }}>
              Manufacturing, address & more
            </Text>
          </View>
        </View>
        <ChevronUp size={18} color="#6b7280" />
      </TouchableOpacity>
      <View style={{ height: 1, backgroundColor: '#e5e7eb', marginHorizontal: 12 }} />
      <FlatList
        data={ProductDescription}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10, paddingTop: 4 }}
        renderItem={({ item }) => (
          <View style={{ width: '100%', margin: 10, paddingHorizontal: 10 }}>
            {item?.title && (
              <Text style={{
                fontSize: 12, color: '#9ca3af', fontWeight: '500',
                textTransform: 'uppercase',
              }}>
                {item.title}
              </Text>
            )}
            {item?.subtitle && (
              <Text style={{
                fontSize: 13, color: '#111827', fontWeight: '400',
                marginTop: 4, lineHeight: 18,
              }}>
                {item.subtitle}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  ) : (
    <TouchableOpacity onPress={() => setIsOpen(true)} style={{
      marginTop: 10, flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', borderRadius: 14, borderWidth: 1,
      borderColor: '#e5e7eb', paddingHorizontal: 14, paddingVertical: 10,
      backgroundColor: '#ffffff',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{
          height: 30, width: 30, borderRadius: 8, backgroundColor: '#fef3c7',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <List size={18} color="#d97706" />
        </View>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 13, color: '#111827', fontWeight: '600' }}>
            Product description
          </Text>
          <Text style={{ fontSize: 11, color: '#6b7280' }}>
            Manufacturing & more
          </Text>
        </View>
      </View>
      <ChevronDown size={18} color="#6b7280" />
    </TouchableOpacity>
  );
};


// ================= REVIEW IMAGE GRID =================
const MAX_VISIBLE = 4;

const ReviewImageGrid = ({ images = [], onPress = () => {} }) => {
  const visibleImages = images.slice(0, MAX_VISIBLE);
  const extraCount = images.length - (MAX_VISIBLE - 1);

  if (!images.length) {
    return null;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: '#fff',
        width,
        marginVertical: 2,
      }}
    >
      <View
        style={{
          padding: 15,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#111827',
            }}
          >
            Customer Reviews
          </Text>

          <Text
            style={{
              fontSize: 11,
              color: '#6b7280',
            }}
          >
            {images.length} photos
          </Text>
        </View>

        {/* Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {visibleImages.map((img, index) => {
            const isLast =
              index === MAX_VISIBLE - 1 && images.length > MAX_VISIBLE;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => onPress(index)}
                style={{
                  width: '23%',
                  aspectRatio: 1,
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              >
                <Image
                  source={{ uri: img }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />

                {isLast && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '700',
                      }}
                    >
                      +{extraCount}
                    </Text>
                    <Text
                      style={{
                        color: '#e5e7eb',
                        fontSize: 10,
                        marginTop: 2,
                      }}
                    >
                      View all
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ================= BUY CARD =================
const BuyCard = ({
  PricingObj,
 wishList ,
 handleWishList,

  quantity,
  AddtoCart,
  Product,
  navigation,
  SelectedOffer,
  Size,
  variant,
  parentId,
  VarientId,
  VarientPrice,
  userModelID,
  setOrder,
  order,
}) => {

  const [cartloading , setCartLoading] = useState(false);




  const handleCartAddition = async ()=>{
    setCartLoading(true);

    try{

      const response = await AddtoCart(parentId,VarientId,Size)

      if(response.success){
        console.log("Added to cart")
      }
      
    }catch(error){
console.log(error);
    }finally{
setCartLoading(false);
    }
  }


  const handleBuy = () => {
    const updatedOrder = {
      ...order,
      offerId: SelectedOffer ?? null,
      size: Size,
      quantity : quantity,
      productId: parentId,
      varientId: VarientId,
      userId: userModelID,
    };


    setOrder(updatedOrder);


    if(updatedOrder.quantity > 0 && PricingObj.stock > 0 &&  PricingObj.stock >= updatedOrder.quantity){
console.log("kkkki am csllenfjkn")
console.log(updatedOrder.quantity)
       navigation.navigate('Screens', {
  screen: 'LocationSelection',
  params: {
    ...updatedOrder ,  productImage : variant.coverImage, ProductName : variant.ProductName , brand : Product.brand , Rating : variant.rating , VarientDiscountedPrice : VarientPrice?.discountedPrice , VarientActualPrice :  VarientPrice?.actualMRP , discountPercentage : VarientPrice?.discountPercentage
  },
});
 


    }

     
    
  };

  return (
    <View style={{ width, backgroundColor: '#fff' }}>
      <View>
{
       PricingObj.stock <= 0 ? (
       
       <View
          style={{
            backgroundColor: '#ffffff',
            paddingVertical: 10,
            paddingHorizontal: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >



            {/* Outline button */}
            <TouchableOpacity

              onPress={handleWishList}
              disabled= {cartloading}
              
              activeOpacity={0.9}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
                
                borderWidth: 1,
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent : 'center',
                width : width*0.40,
                height : 40,
                gap: 6,
              }}
            >
              <Heart size={18} fill={wishList ? 'red' : 'transparent'} color="black" />
              {cartloading ? (<ActivityIndicator size={18} color={'#fff'} />) : ( <Text
                style={{
                  color: '#111827',
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {wishList ? 'Remove' : 'Wishlist'}
              </Text>)}
            </TouchableOpacity>

            {/* Primary button */}
            <TouchableOpacity
              onPress={handleBuy}
              activeOpacity={0.9}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 9,
                borderRadius: 10,
                backgroundColor: '#111827',
                flexDirection: 'row',
                width : width*0.40,
                alignItems: 'center',
                height : 40,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                }}
              >
                Notify Me
              </Text>
            </TouchableOpacity>
         




        </View>


)

     : (  <View
          style={{
            backgroundColor: '#ffffff',
            paddingVertical: 10,
            paddingHorizontal: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          {/* Left: Price info */}
         
             <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 11,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                fontWeight: '600',
              }}
            >
              Total payable
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: '#111827',
                }}
              >
                ₹{Number(VarientPrice?.discountedPrice)*Number(quantity)}
              </Text>
            </View>
          </View>
          
         

          {/* Right: Buttons */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* Outline button */}
            <TouchableOpacity

              onPress={handleCartAddition}
              disabled= {cartloading}
              activeOpacity={0.9}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ShoppingCart size={18} color="#111827" />
              {cartloading ? (<ActivityIndicator size={18} color={'#fff'} />) : ( <Text
                style={{
                  color: '#111827',
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                Add to cart
              </Text>)}
            </TouchableOpacity>

            {/* Primary button */}
            <TouchableOpacity
              onPress={handleBuy}
              activeOpacity={0.9}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: '#111827',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                }}
              >
                Buy now
              </Text>
            </TouchableOpacity>
          </View>


        </View>)}


      </View>
    </View>
  );
};

// ================= RECOMMENDED SECTION =================
const mockRecommendedProducts = [
  {
    id: 'r1',
    name: "Men's Black Graphic T-shirt",
    price: 599,
    rating: 4.3,
    image:
      'https://images.bewakoof.com/t1080/men-s-black-goosebumps-graphic-printed-t-shirt-546564-1742902216-1.jpg',
  },
  {
    id: 'r2',
    name: "Men's Oversized NASA Tee",
    price: 799,
    rating: 4.6,
    image:
      'https://images.bewakoof.com/t1080/men-s-black-explorer-nasa-graphic-printed-oversized-t-shirt-591083-1758612936-1.jpg',
  },
  {
    id: 'r3',
    name: "Men's White Minimal Tee",
    price: 549,
    rating: 4.1,
    image:
      'https://images.bewakoof.com/t540/men-s-white-t-shirt-106-1644310217-1.jpg',
  },
  {
    id: 'r4',
    name: "Men's Blue Typography Tee",
    price: 699,
    rating: 4.4,
    image:
      'https://images.bewakoof.com/t540/men-s-blue-typography-t-shirt-462123-1655748123-1.jpg',
  },
  {
    id: 'r5',
    name: "Men's Green Streetwear Tee",
    price: 749,
    rating: 4.5,
    image:
      'https://images.bewakoof.com/t540/men-s-green-oversized-t-shirt-531234-1684321934-1.jpg',
  },
  {
    id: 'r6',
    name: "Men's Red Printed Tee",
    price: 629,
    rating: 4.2,
    image:
      'https://images.bewakoof.com/t540/men-s-red-printed-t-shirt-412345-1623123123-1.jpg',
  },
];

const RecommendedSection = ({ onPressViewAll = () => {} }) => {
  return (
    <View
      style={{
        backgroundColor: '#ffffffff',
        paddingVertical: 16,
        marginTop: 3,
        width,
      }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: '700',
            color: '#111827',
          }}
        >
          Recommend
        </Text>

        <TouchableOpacity onPress={onPressViewAll} activeOpacity={0.8}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#2563eb',
            }}
          >
            View all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal list */}
      <FlatList
        data={mockRecommendedProducts}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              width: 140,
              marginRight: 10,
              marginBottom: 3,
              borderRadius: 14,
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                height: 150,
                backgroundColor: '#e5e7eb',
              }}
              resizeMode="cover"
            />
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                {item.name}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: '#111827',
                  }}
                >
                  ₹{item.price}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: '#fef3c7',
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderRadius: 999,
                  }}
                >
                  <Star size={10} color="#f59e0b" fill="#f59e0b" />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: '#92400e',
                    }}
                  >
                    {item.rating}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// ================= MAIN SCREEN =================
const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const rawParams = route.params || {};
  

const productId =
  rawParams?.productId?._id ?? 
  rawParams?.productId ??
  rawParams?.params?.productId?._id;

const varientId =
  rawParams?.varientId ??
  rawParams?.params?.varientId;


  


if (!productId || !varientId) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Invalid navigation: productId / varientId missing</Text>
    </View>
  );
}


  const { loadPerticularProduct, userModelID ,deleteWishlists, AddtoCart , AddtoWishlists , CheckwishList} = userStore();

  const [Product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quantity , setQuantity] = useState(0);
  const [SelectedOffer, setSelectedOffer] = useState(null); 
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [wishList , setWishlist] = useState(false);
    const [wishListId , setWishlistId] = useState('');
  const [order, setOrder] = useState({
    userId: '',
    productId: '',
    varientId: '',
    offerId: '',
    size: '',
    
  });



  const CheckMyWishList = async ()=>{

    console.log(productId,varientId,selectedSize)
  const req = await CheckwishList(productId,varientId,selectedSize); 

    if(req.success){
      
      setWishlist(true)
      setWishlistId(req.wishListId)
    }else if(!req.success){
        
      setWishlist(false)
      setWishlistId('')
    }
  }
  useEffect(()=>{
  CheckMyWishList()
  },[])

   useEffect(()=>{
  CheckMyWishList()
  },[selectedSize])



  const fetchProduct = async (isRefresh = false) => {

    if (!isRefresh) setIsLoading(true);

    try {


      
      const response = await loadPerticularProduct(varientId, productId);

       
      if (response.success) {
     
        setProduct(response.ParentProduct);
        setVariant(response.SelectedVariant);

        const firstPricing = response.SelectedVariant?.pricing?.[0];
        const initialSize = firstPricing?.size || response.SelectedVariant?.ProductSize?.[0] || '';

        if(firstPricing.stock > 0 ) {
  setQuantity(1)
        }
        else{
          setQuantity(0)
        }
         
        setSelectedSize(initialSize);
        setSelectedPrice(firstPricing || null);
        setSelectedOffer(null);

        setOrder(prev => ({
          ...prev,
          productId,
          varientId,
          size: initialSize,
          offerId: '',
          userId: userModelID,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [varientId, productId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProduct(true);
  }, [varientId, productId]);

  const images = useMemo(() => {
    if (!variant) return [];
    return [variant.coverImage, ...(variant.images || [])];
  }, [variant]);

  const onSizeChange = (size) => {

    if (!variant?.pricing) return;

    const priceObj = variant.pricing.find(p => p.size === size);
    setSelectedSize(size);
    setSelectedPrice(priceObj || null);
    if(quantity > priceObj.stock){
setQuantity(priceObj.stock)
    }else if (quantity === 0 && priceObj.stock > 0){
setQuantity(1)
    }
    
    setSelectedOffer(null);
    setOrder(prev => ({
      ...prev,
      size,
      productId,
      varientId,
    }));
  };



    const handleWishList = async ()=>{
    try{
console.log(wishList)

      if(!wishList){
        console.log("add to wishlish called")
const res = await AddtoWishlists(productId,varientId,selectedSize)
     if(res.success){
      setWishlist(true);
      setWishlistId(res.wishListId)
     }

      }else if(wishList){
        const res = await deleteWishlists(wishListId);
        if(res.success){
          setWishlist(false)
          setWishlistId('')
        }
      }
     
    }catch(error){
      console.log(error)
    }
  }



  if (isLoading || !Product || !variant) {
    return (
      <View style={{ flex: 1 }}>
       <ProductDetailSkeleton />
      </View>
    );
  }

  const Components = [
    {
      id: 'image-slider',
      render: () => (
        <ProductImageSlider
          images={images}
          rating={variant.rating}
          totalSoldOut={variant.totalSold}
        />
      ),
    },
    {
      id: 'product-name',
      render: () => (
        <ProductName
          data={{

            name: variant.ProductName,
            brand: Product.BrandName,
            price: selectedPrice,
            
          } 
         
        }
        wishList = {wishList}
        handleWishList={handleWishList}

        quantity={quantity}  setQuantity={setQuantity}
        />
      ),
    },
    {
      id: 'variant-section',
      render: () => (
        <ProductVarient
          variants={Product.Variants}
          selectedVariantId={variant._id}
          onVariantSelect={(newVariantId) => {
            setSelectedOffer(null);
            setSelectedSize('');
            setSelectedPrice(null);
            navigation.replace('ProductDetail', {
              productId,
              varientId: newVariantId,
            });
          }}
        />
      ),
    },
    {
      id: 'size-section',
      render: () => (
        <SizeSection
          sizeScale={variant.ProductSize}
          selectedSize={selectedSize}
          onSizeChange={onSizeChange}
        />
      ),
    },
    {
  id: 'offer-section',
  render: () => (
    <OfferSection
      offers={variant.offers || []}
      SelectedOffer={SelectedOffer}
      setSelectedOffer={(offerId) => {
        setSelectedOffer(offerId);
        setOrder(prev => ({ ...prev, offerId: offerId ?? null }));
      }}
    />
  ),
},

    {
      id: 'all-detail',
      render: () => (
        <AllDetail
          ProductDescription={Product.ProductDescription}
          ProductDetail={Product.ProductDetail}
          ReturnPolicy={Product.ReturnPolicy}
        />
      ),
    },
    {
      id: 'review-images',
      render: () => (
        <ReviewImageGrid images={Product.ReviewImages || []} />
      ),
    },
   {
  id: 'rating-section',
  render: () => (
    <RatingOrRateButton
      variant={variant}
      Product={Product}
      navigation={navigation}
      productId={productId}
      varientId={varientId}
      width={width}
    />
  ),
},

    {
      id: 'recommended',
      render: () => <RecommendedSection />,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <CollapsableHeader navigation={navigation} />

      <FlatList
        data={Components}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item.render()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <BuyCard
       wishList = {wishList}
        handleWishList={handleWishList}

      quantity={quantity}
      PricingObj={selectedPrice}
      AddtoCart = {AddtoCart}
      Product = {Product}
      ProductName = {variant.ProductName}
      variant={variant}
       navigation = {navigation}
        SelectedOffer={SelectedOffer}
        Size={selectedSize}
        parentId={variant.Parent}
        VarientId={variant._id}
        userModelID={userModelID}
        VarientPrice={selectedPrice}
        order={order}
        setOrder={setOrder}
      />
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  header: {
    width,
    backgroundColor: '#f9d800ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  image: {
    width,
    height: 450,
    resizeMode: 'cover',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: '#fff',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000000ff',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingLeft: 15,
    gap: 6,
  },
  imageWrapper: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  images: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },


  
  Quantitycontainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
    width: 110,
    height: 36,
  },

  button: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },

  text: {
    fontSize: 18,
    fontWeight: "600",
  },

  countBox: {
    flex: 1,
    alignItems: "center",
  },

  count: {
    fontSize: 16,
    fontWeight: "500",
  },


});
