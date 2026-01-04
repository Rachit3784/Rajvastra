// ProductDetailScreen.js

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useNavigation, useRoute } from '@react-navigation/native';

// Lucide icons
import {
  ChevronLeft,
  ShoppingBag,
  ShoppingCart,
  Share2,
  Heart,
  Percent,
  Tag,
  Truck,
  RotateCcw,
  Headphones,
  ChevronUp,
  ChevronDown,
  UserCircle2,
} from 'lucide-react-native';

import userStore from '../../../store/MyStore';

// ------------ CONFIG -------------
const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 90;
const FOOTER_HEIGHT = 95;
const SNAP_THRESHOLD = 50;
const MODERN_PADDING = 16;
const MAX_VISIBLE_REVIEW_IMAGES = 5;

// ------------ COLORS -------------
const COLORS = {
  white: '#FFFFFF',
  background: '#F9F9F9',
  primary: '#1E90FF',
  secondary: '#FF8C00',
  darkText: '#101010',
  mediumGray: '#6B7280',
  lightGray: '#EFEFEF',
  ratingStar: '#FFC700',
  dangerRed: '#D9534F',
  cardBackground: '#FFFFFF',
  separator: '#EEEEEE',
};

// ------------ INITIAL STATE -------
const INITIAL_PRODUCT_STATE = {
  ProductDescription: 'High-quality product detail loading...',
  TotalLikes: 0,
  FAQS: [],
  Reviews: [],
  TotalReviews: 0,
  ProductOffer: [],
  TimeToDelivar: '3-5 days',
  ReviewImages: [],
  ReturnPolicy: '15 Day Returns Available',
  Variants: [],
  ProductName: 'Premium Product',
  VarientOffer: [],
  ProductPrice: 0.0,
  ProductSize: [],
  Images: ['https://via.placeholder.com/400x400/F0F0F0/6B7280?text=Image+Loading'],
  ProductRatings: 0.0,
  VideoLink: [],
};

// Mock recommended products
const MOCK_RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    name: 'Luxury Leather Belt',
    price: 1299,
    image: 'https://picsum.photos/seed/rec1/100/150',
  },
  {
    id: 2,
    name: 'Premium Casual Watch',
    price: 2500,
    image: 'https://picsum.photos/seed/rec2/100/150',
  },
  {
    id: 3,
    name: 'Slim Fit Chinos',
    price: 899,
    image: 'https://picsum.photos/seed/rec3/100/150',
  },
  {
    id: 4,
    name: 'Stylish Backpack',
    price: 1500,
    image: 'https://picsum.photos/seed/rec4/100/150',
  },
];

// -------- helper: extract youtube id ----------
const extractVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(
    /(youtu\.be\/|youtube\.com\/(watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[3] : null;
};

// =============== 1. Skeleton Loader ===============
const SkeletonLoader = () => (
  <View style={skeletonStyles.container}>
    <View style={skeletonStyles.imagePlaceholder} />
    <View style={[skeletonStyles.cardPlaceholder, { height: 120 }]} />
    <View style={skeletonStyles.textLine} />
    <View style={[skeletonStyles.textLine, { width: '60%' }]} />
    <View style={skeletonStyles.cardPlaceholder} />
    <View style={skeletonStyles.cardPlaceholder} />
  </View>
);

// =============== 2. Collapsible Header ===============
const CollapsibleHeader = memo(({ headerTranslateY }) => {
  const navigation = useNavigation();

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  return (
    <Animated.View style={[headerStyles.header, headerStyle]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={headerStyles.content}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={headerStyles.iconButton}
          >
            <ChevronLeft size={24} color={COLORS.darkText} />
          </TouchableOpacity>

          <Text style={headerStyles.title}>Product Details</Text>

          <TouchableOpacity style={headerStyles.iconButton}>
            <ShoppingBag size={22} color={COLORS.darkText} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
});

// =============== 3. Bottom CTA Bar ===============
const BottomCTABar = memo(({ footerTranslateY, price }) => {
  const footerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: footerTranslateY.value }],
  }));

  return (
    <Animated.View style={[footerStyles.footer, footerStyle]}>
      <View style={footerStyles.priceContainer}>
        <Text style={footerStyles.label}>Current Price</Text>
        <Text style={footerStyles.price}>₹{price}</Text>
      </View>

      <TouchableOpacity style={footerStyles.cartButton}>
        <ShoppingCart size={20} color={COLORS.white} />
        <Text style={footerStyles.cartButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={footerStyles.buyButton}>
        <Text style={footerStyles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

// =============== 4. Video Card ===============
const VideoCard = memo(({ videoId, isPlaying, onStateChange }) => (
  <View style={videoStyles.videoCard}>
    <YoutubePlayer
      height={videoStyles.videoCard.height}
      width={videoStyles.videoCard.width}
      play={isPlaying}
      videoId={videoId}
      onChangeState={onStateChange}
    />
  </View>
));

// =============== 5. Review Image Gallery ===============
const ReviewImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  const imagesToShow = images.slice(0, MAX_VISIBLE_REVIEW_IMAGES);
  const remainingCount = images.length - MAX_VISIBLE_REVIEW_IMAGES;

  const renderItem = ({ item, index }) => {
    const isLastIndex = index === MAX_VISIBLE_REVIEW_IMAGES - 1;
    const shouldShowOverlay = isLastIndex && remainingCount > 0;

    if (shouldShowOverlay) {
      return (
        <TouchableOpacity
          style={galleryStyles.lastImageContainer}
          onPress={() => Alert.alert('View All', 'Feature coming soon!')}
        >
          <Image source={{ uri: item }} style={galleryStyles.imageItem} blurRadius={1.5} />
          <View style={galleryStyles.overlay}>
            <Text style={galleryStyles.overlayText}>+{remainingCount}</Text>
            <Text style={galleryStyles.overlayTextSmall}>View All</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (index < MAX_VISIBLE_REVIEW_IMAGES) {
      return (
        <TouchableOpacity
          key={`rev-img-${index}`}
          style={galleryStyles.imageContainer}
        >
          <Image source={{ uri: item }} style={galleryStyles.imageItem} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={productStyles.cardSection}>
      <View style={productStyles.recommendedHeader}>
        <Text style={productStyles.sectionTitle}>
          Customer Photos ({images.length})
        </Text>
        <TouchableOpacity
          onPress={() => Alert.alert('View All', 'Feature coming soon!')}
        >
          <Text
            style={{ color: COLORS.primary, fontSize: 13, fontWeight: '600' }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={imagesToShow}
        renderItem={renderItem}
        keyExtractor={(_, index) => `reviewImg-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 5 }}
      />
    </View>
  );
};

// =============== 6. Image Section ===============
const ImageSection = memo(({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <View style={productStyles.mainImagePlaceholder}>
        <Text style={{ color: COLORS.mediumGray }}>No Images Available</Text>
      </View>
    );
  }

  return (
    <View style={{ height: width, width, backgroundColor: COLORS.lightGray }}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setActiveIndex(Math.round(x / width));
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={productStyles.mainImage}
            resizeMode="cover"
          />
        )}
      />

      <View style={productStyles.topRightButtons}>
        <TouchableOpacity style={productStyles.wishlistButton}>
          <Share2 size={18} color={COLORS.darkText} />
        </TouchableOpacity>
        <TouchableOpacity style={productStyles.wishlistButton}>
          <Heart size={18} color={COLORS.darkText} />
        </TouchableOpacity>
      </View>

      <View style={productStyles.imageDotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              productStyles.imageDot,
              {
                backgroundColor:
                  index === activeIndex ? COLORS.primary : COLORS.mediumGray,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
});

// =============== 7. Name, Price, Ratings ===============
const NamePriceRating = ({
  name,
  price,
  rating,
  totalReviews,
  totalLikes,
}) => {
  const renderStars = (starRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i += 1) {
      let iconState = 'empty';
      if (i <= starRating) iconState = 'full';
      else if (i - 1 < starRating && starRating < i) iconState = 'half';

      stars.push(
        <View
          key={i}
          style={{
            width: 16,
            height: 16,
            marginRight: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor:
                iconState === 'empty' ? COLORS.lightGray : COLORS.ratingStar,
            }}
          />
        </View>,
      );
    }
    return stars;
  };

  const reviewText = `${totalReviews}`;
  const likeText = `${totalLikes}`;

  return (
    <View style={productStyles.cardSection}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={productStyles.productPrice}>₹{price}</Text>
          <Text style={productStyles.productName}>{name}</Text>
        </View>

        {rating > 0 && (
          <View style={productStyles.ratingBox}>
            {renderStars(rating)}
            <Text style={productStyles.ratingValue}>{rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={productStyles.metadataContainer}>
        {totalReviews > 0 && (
          <>
            <Text style={productStyles.ratingText}>
              <Text style={{ fontWeight: 'bold' }}>{reviewText}</Text> Reviews
            </Text>
            <View style={productStyles.metadataSeparator} />
          </>
        )}
        {totalLikes > 0 && (
          <Text style={productStyles.ratingText}>
            <Text style={{ fontWeight: 'bold' }}>{likeText}</Text> Likes
          </Text>
        )}
      </View>
    </View>
  );
};

// =============== 8. Size Selection ===============
const SizeSelection = ({ productSizes, selectedSize, setSelectedSize }) => {
  if (!productSizes || productSizes.length === 0) return null;

  return (
    <View style={{ marginTop: 15, marginBottom: 5 }}>
      <View style={{ paddingHorizontal: MODERN_PADDING }}>
        <Text style={productStyles.sectionTitle}>
          Size{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {selectedSize ? selectedSize : 'Select'}
          </Text>
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: MODERN_PADDING,
          paddingVertical: 8,
        }}
      >
        {productSizes.map((item, index) => {
          const selected = item === selectedSize;
          return (
            <TouchableOpacity
              key={index}
              style={[
                chipStyles.chipContainer,
                selected && chipStyles.chipContainerSelected,
              ]}
              onPress={() => setSelectedSize(item)}
            >
              <Text
                style={[
                  chipStyles.chipText,
                  selected && chipStyles.chipTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// =============== 9. Variant Selection ===============
const VariantSelection = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  if (!variants || variants.length <= 1) return null;

  const renderVariantItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={chipStyles.variantItem}
      onPress={() => onSelectVariant(item)}
    >
      <View
        style={[
          chipStyles.variantImageContainer,
          selectedVariant?.id === item.id &&
            chipStyles.variantImageContainerSelected,
        ]}
      >
        <Image
          source={{
            uri:
              item.coverImage ||
              (item.Images && item.Images[0]) ||
              'https://via.placeholder.com/60',
          }}
          style={chipStyles.variantImage}
        />
      </View>
      <Text style={chipStyles.variantText} numberOfLines={1}>
        {(item.ProductName &&
          item.ProductName.split('-')[item.ProductName.split('-').length - 1]) ||
          'Variant'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 15 }}>
      <View style={{ paddingHorizontal: MODERN_PADDING }}>
        <Text style={productStyles.sectionTitle}>
          Color{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {(selectedVariant &&
              selectedVariant.ProductName &&
              selectedVariant.ProductName.split('-')[
                selectedVariant.ProductName.split('-').length - 1
              ]) ||
              'Select'}
          </Text>
        </Text>
      </View>

      <FlatList
        horizontal
        data={variants}
        renderItem={renderVariantItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: MODERN_PADDING,
          paddingVertical: 5,
        }}
      />
    </View>
  );
};

// =============== 10. Combined Size + Variant ===============
const CombinedSelection = ({
  allVariants,
  selectedVariant,
  onSelectVariant,
  selectedSize,
  setSelectedSize,
}) => {
  const productSizes = (selectedVariant && selectedVariant.ProductSize) || [];

  if (productSizes.length === 0 && (!allVariants || allVariants.length <= 1)) {
    return null;
  }

  return (
    <View
      style={{
        marginBottom: MODERN_PADDING,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.separator,
      }}
    >
      {allVariants && allVariants.length > 1 && (
        <VariantSelection
          variants={allVariants}
          selectedVariant={selectedVariant}
          onSelectVariant={onSelectVariant}
        />
      )}

      {productSizes.length > 0 && (
        <SizeSelection
          productSizes={productSizes}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />
      )}
    </View>
  );
};

// =============== 11. Offer Card ===============
const OfferCard = ({ offer }) => (
  <View style={offerStyles.card}>
    <View
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}
    >
      {(offer.offerName || '').toLowerCase().includes('discount') ? (
        <Percent size={20} color={COLORS.primary} style={offerStyles.icon} />
      ) : (
        <Tag size={20} color={COLORS.primary} style={offerStyles.icon} />
      )}
      <Text style={offerStyles.title} numberOfLines={1}>
        {offer.offerName}
      </Text>
    </View>
    <Text style={offerStyles.description} numberOfLines={2}>
      {offer.offerDescription}
    </Text>
    <TouchableOpacity
      style={[
        offerStyles.applyButton,
        offer.apply && offerStyles.appliedButton,
      ]}
      onPress={() =>
        Alert.alert('Offer Applied', `Applied ${offer.offerName}`)
      }
    >
      <Text
        style={[
          offerStyles.applyButtonText,
          offer.apply && { color: COLORS.white },
        ]}
      >
        {offer.apply ? 'Applied' : 'Apply'}
      </Text>
    </TouchableOpacity>
  </View>
);

// =============== 12. Offers Section ===============
const OffersSection = ({ offers }) => {
  const uniqueOffers =
    (offers &&
      offers.reduce((acc, current) => {
        const x = acc.find((item) => item.offerName === current.offerName);
        if (!x) return acc.concat(current);
        return acc;
      }, [])) ||
    [];

  if (!uniqueOffers || uniqueOffers.length === 0) return null;

  return (
    <View style={productStyles.cardSection}>
      <Text style={productStyles.sectionTitle}>Special Offers</Text>
      <FlatList
        horizontal
        data={uniqueOffers}
        renderItem={({ item }) => <OfferCard offer={item} />}
        keyExtractor={(item, index) => `${item.offerName}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 5 }}
      />
    </View>
  );
};

// =============== 13. Delivery Section ===============
const DeliverySection = ({ info }) => {
  const deliveryTime = info.deliveryTime || '5-7 Business Days';
  const returnPolicy = info.returnPolicy || '15 Day Returns Available';

  return (
    <View style={productStyles.cardSection}>
      <Text style={productStyles.sectionTitle}>Delivery & Service</Text>

      <View style={productStyles.deliveryCardContainer}>
        <View style={productStyles.deliveryCard}>
          <Truck size={24} color={COLORS.primary} />
          <Text style={productStyles.deliveryCardText}>{deliveryTime}</Text>
        </View>

        <View style={productStyles.deliveryCard}>
          <RotateCcw size={24} color={COLORS.primary} />
          <Text style={productStyles.deliveryCardText}>{returnPolicy}</Text>
        </View>

        <View style={productStyles.deliveryCard}>
          <Headphones size={24} color={COLORS.primary} />
          <Text style={productStyles.deliveryCardText}>24/7 Support</Text>
        </View>
      </View>
    </View>
  );
};

// =============== 14. Video Section ===============
const VideoSection = ({ videoIds }) => {
  const videoIDs =
    (videoIds &&
      videoIds
        .map((url) => extractVideoId(url))
        .filter((id) => !!id && id.length === 11)) ||
    [];

  if (!videoIDs || videoIDs.length === 0) return null;

  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(
    videoIDs[0] || null,
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;
    const visibleVideoId = viewableItems[0].item;
    setCurrentlyPlayingId(visibleVideoId);
  }).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 75 };

  const onVideoStateChange = useCallback((_state) => {}, []);

  const renderItem = useCallback(
    ({ item }) => (
      <VideoCard
        videoId={item}
        isPlaying={item === currentlyPlayingId}
        onStateChange={onVideoStateChange}
      />
    ),
    [currentlyPlayingId, onVideoStateChange],
  );

  return (
    <View style={productStyles.cardSection}>
      <Text style={productStyles.sectionTitle}>
        <Text style={{ fontWeight: 'bold' }}>Product Video Gallery</Text>
      </Text>
      <FlatList
        horizontal
        pagingEnabled
        data={videoIDs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={videoStyles.flatListContainer}
      />
    </View>
  );
};

// =============== 15. Collapsible Section ===============
const CollapsibleSection = ({
  title,
  content,
  contentType,
  totalCount,
}) => {
  const isArray = Array.isArray(content);
  const isEmpty =
    (!isArray &&
      (typeof content !== 'string' || content.trim().length === 0)) ||
    (isArray && content.length === 0);

  if (isEmpty) return null;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={productStyles.collapsibleContainer}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={productStyles.collapsibleHeader}
      >
        <Text style={productStyles.collapsibleTitle}>{title}</Text>
        {isOpen ? (
          <ChevronUp size={20} color={COLORS.mediumGray} />
        ) : (
          <ChevronDown size={20} color={COLORS.mediumGray} />
        )}
      </TouchableOpacity>

      {isOpen && (
        <View style={productStyles.collapsibleContent}>
          {contentType === 'description' && (
            <Text style={productStyles.collapsibleText}>{content}</Text>
          )}

          {contentType === 'reviews' &&
            isArray &&
            content.map((item, index) => (
              <View
                key={item.id || index}
                style={{
                  marginVertical: 8,
                  paddingBottom: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.separator,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <UserCircle2
                    size={16}
                    color={COLORS.mediumGray}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: COLORS.darkText,
                    }}
                  >
                    Verified Customer
                  </Text>
                </View>
                <Text style={productStyles.collapsibleText}>{item.Text}</Text>
              </View>
            ))}

          {contentType === 'faqs' &&
            isArray &&
            content.map((item, index) => (
              <View
                key={item.id || index}
                style={{
                  marginVertical: 8,
                  paddingBottom: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.separator,
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: COLORS.darkText,
                    marginBottom: 4,
                  }}
                >
                  Q: {item.Qus}
                </Text>
                <Text style={productStyles.collapsibleText}>A: {item.Ans}</Text>
              </View>
            ))}

          {isArray &&
            totalCount &&
            totalCount > content.length && (
              <TouchableOpacity
                style={{ marginTop: 10, alignSelf: 'center' }}
                onPress={() =>
                  Alert.alert('View All', 'Feature coming soon!')
                }
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: '600',
                  }}
                >
                  View All {totalCount} {contentType.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
        </View>
      )}
    </View>
  );
};

// =============== 16. Recommended Products ===============
const RecommendedCard = ({ item }) => (
  <TouchableOpacity style={productStyles.recommendedItem}>
    <Image
      source={{
        uri: item.image || 'https://via.placeholder.com/100',
      }}
      style={productStyles.recommendedImage}
    />
    <Text style={productStyles.recommendedName} numberOfLines={2}>
      {item.name || 'Recommended Product'}
    </Text>
    <Text style={productStyles.recommendedPrice}>₹{item.price || '0.00'}</Text>
  </TouchableOpacity>
);

const OtherRecommendedProduct = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <View style={productStyles.cardSection}>
      <View style={productStyles.recommendedHeader}>
        <Text style={productStyles.sectionTitle}>You Might Also Like</Text>
        <TouchableOpacity>
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={products}
        renderItem={({ item }) => <RecommendedCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 5 }}
      />
    </View>
  );
};

// ===================== MAIN SCREEN =====================
const ProductDetailScreen = () => {
  const route = useRoute();
  const { productId: parentId, varientId: initialVariantId } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isVariantSwitching, setIsVariantSwitching] = useState(false);
  const [parentProduct, setParentProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeVariantId, setActiveVariantId] = useState(initialVariantId);

  const { loadPerticularProduct } = userStore(); // from your store[file:2]

  const product = parentProduct || INITIAL_PRODUCT_STATE;
  const variant = selectedVariant || INITIAL_PRODUCT_STATE;

  const loadProductDetail = async (variantIdToLoad, parentIdToLoad) => {
    if (!parentIdToLoad || !variantIdToLoad) {
      Alert.alert('Error', 'Missing product or variant ID.');
      setIsLoading(false);
      return;
    }

    const isInitialLoad = !parentProduct;
    
    if (isInitialLoad) setIsLoading(true);
    else setIsVariantSwitching(true);

    try {
      const response = await loadPerticularProduct(
        variantIdToLoad,
        parentIdToLoad,
      );

      if (response && response.success) {
        const fetchedParent = response.ParentProduct;
        const fetchedVariant = response.VarientChild;

        setParentProduct(fetchedParent);
        setSelectedVariant(fetchedVariant);
        setActiveVariantId(fetchedVariant.id);

        if (
          fetchedVariant.ProductSize &&
          fetchedVariant.ProductSize.length > 0
        ) {
          setSelectedSize(fetchedVariant.ProductSize[0]);
        } else {
          setSelectedSize(null);
        }
      } else {
        console.error(
          (response && response.msg) || 'Failed to fetch product details',
        );
      }
    } catch (error) {
      console.error('Fetch error', error);
    } finally {
      if (isInitialLoad) setIsLoading(false);
      else setIsVariantSwitching(false);
    }
  };

  const handleVariantSelect = (newVariant) => {
    if (newVariant.id === activeVariantId || isVariantSwitching) return;

    setSelectedVariant(newVariant);
    setActiveVariantId(newVariant.id);

    if (parentProduct && newVariant.id && parentProduct.id) {
      loadProductDetail(newVariant.id, parentProduct.id);
    } else {
      console.error('Cannot switch variant. Missing parent or variant ID.');
    }
  };

  useEffect(() => {
    if (initialVariantId && parentId) {
      loadProductDetail(initialVariantId, parentId);
    } else {
      setIsLoading(false);
    }
  }, [initialVariantId, parentId]);

  const headerTranslateY = useSharedValue(0);
  const footerTranslateY = useSharedValue(FOOTER_HEIGHT);
  const lastScrollY = useRef(0);

  const handleScroll = (event) => {
    if (isLoading || isVariantSwitching) return;

    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    if (currentScrollY > SNAP_THRESHOLD && diff > 0) {
      headerTranslateY.value = withTiming(-HEADER_HEIGHT, { duration: 300 });
      footerTranslateY.value = withTiming(FOOTER_HEIGHT, { duration: 300 });
    } else if (diff < -5) {
      headerTranslateY.value = withTiming(0, { duration: 300 });
      footerTranslateY.value = withTiming(0, { duration: 300 });
    }

    lastScrollY.current = currentScrollY;
  };

  if (isLoading && !parentProduct) {
    return <SkeletonLoader />;
  }

  const currentImages = variant.Images;
  const currentPrice =
    typeof variant.ProductPrice === 'number'
      ? variant.ProductPrice.toFixed(2)
      : '0.00';
  const currentName =
    variant.ProductName || product.ProductName || 'Product Name';
  const currentRating = variant.ProductRatings || 0;
  const totalReviews = product.TotalReviews || 0;
  const totalLikes = product.TotalLikes || 0;

  const combinedOffers = [
    ...(product.ProductOffer || []),
    ...(variant.VarientOffer || []),
  ].filter((o) => !!(o && o.offerName));

  const deliveryInfo = {
    deliveryTime: product.TimeToDelivar,
    returnPolicy: product.ReturnPolicy,
  };

  const videoLinks = variant.VideoLink || [];
  const reviewImages = product.ReviewImages || [];

  const productDescription =
    product.ProductDescription || 'No description provided.';
  const reviewsList = product.Reviews || [];
  const faqsList = product.FAQS || [];

  return (
    <View style={globalStyles.container}>
      <CollapsibleHeader headerTranslateY={headerTranslateY} />

      {isVariantSwitching && (
        <View style={globalStyles.switchingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={globalStyles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <ImageSection images={currentImages} />

        <NamePriceRating
          name={currentName}
          price={currentPrice}
          rating={currentRating}
          totalReviews={totalReviews}
          totalLikes={totalLikes}
        />

        <CombinedSelection
          allVariants={product.Variants || []}
          selectedVariant={selectedVariant}
          onSelectVariant={handleVariantSelect}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />

        <OffersSection offers={combinedOffers} />

        <DeliverySection info={deliveryInfo} />

        <View style={globalStyles.sectionSeparator} />

        <CollapsibleSection
          title="Product Details"
          content={productDescription}
          contentType="description"
        />

        {videoLinks.length > 0 && <VideoSection videoIds={videoLinks} />}

        {reviewImages.length > 0 && (
          <ReviewImageGallery images={reviewImages} />
        )}

        <CollapsibleSection
          title="Customer Reviews"
          content={reviewsList.slice(0, 3)}
          contentType="reviews"
          totalCount={totalReviews}
        />

        <CollapsibleSection
          title="Questions & Answers"
          content={faqsList.slice(0, 3)}
          contentType="faqs"
          totalCount={faqsList.length}
        />

        <OtherRecommendedProduct products={MOCK_RECOMMENDED_PRODUCTS} />

        <View style={{ height: FOOTER_HEIGHT + MODERN_PADDING }} />
      </ScrollView>

      <BottomCTABar footerTranslateY={footerTranslateY} price={currentPrice} />
    </View>
  );
};

export default ProductDetailScreen;

// ===================== STYLES =====================

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingBottom: MODERN_PADDING,
    paddingTop: HEADER_HEIGHT + 3,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginHorizontal: MODERN_PADDING,
    marginVertical: MODERN_PADDING / 2,
  },
  switchingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const headerStyles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.white,
    zIndex: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingTop : 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MODERN_PADDING,
   
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkText,
    
    marginBottom: -2,
  },
  iconButton: {
    padding: 5,
  },
});

const footerStyles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    backgroundColor: COLORS.white,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: MODERN_PADDING,
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  priceContainer: {
    flex: 1,
    marginRight: MODERN_PADDING,
  },
  label: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkText,
  },
  cartButton: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flex: 1.2,
  },
  cartButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 5,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.2,
  },
  buyButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

const productStyles = StyleSheet.create({
  cardSection: {
    paddingHorizontal: MODERN_PADDING,
    paddingVertical: MODERN_PADDING / 2,
 
    backgroundColor: COLORS.cardBackground,
  },
  mainImage: {
    width,
    height: width,
  },
  mainImagePlaceholder: {
    width,
    
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  topRightButtons: {
    position: 'absolute',
    top:  15,
    right: MODERN_PADDING,
    flexDirection: 'row',
  },
  wishlistButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
  imageDotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.darkText,
    marginBottom: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 10,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkText,
    marginLeft: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  metadataSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.separator,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 10,
  },
  deliveryCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  deliveryCard: {
    width: (width - MODERN_PADDING * 2 - 16) / 3,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.separator,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  deliveryCardText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.mediumGray,
    marginTop: 5,
    textAlign: 'center',
  },
  collapsibleContainer: {
    paddingHorizontal: MODERN_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    backgroundColor: COLORS.cardBackground,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: MODERN_PADDING,
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  collapsibleContent: {
    paddingBottom: MODERN_PADDING,
  },
  collapsibleText: {
    fontSize: 14,
    color: COLORS.mediumGray,
    lineHeight: 20,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendedItem: {
    width: 120,
    marginRight: MODERN_PADDING,
    alignItems: 'center',
  },
  recommendedImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: COLORS.lightGray,
  },
  recommendedName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.darkText,
    textAlign: 'center',
    height: 34,
  },
  recommendedPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkText,
    marginTop: 4,
  },
});

const chipStyles = StyleSheet.create({
  chipContainer: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 50,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipContainerSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkText,
  },
  chipTextSelected: {
    color: COLORS.white,
  },
  variantItem: {
    marginRight: MODERN_PADDING,
    alignItems: 'center',
    width: 70,
  },
  variantImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.separator,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  variantImageContainerSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2.5,
  },
  variantImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  variantText: {
    fontSize: 12,
    color: COLORS.darkText,
    textAlign: 'center',
  },
});

const offerStyles = StyleSheet.create({
  card: {
    width: width * 0.7,
    marginRight: MODERN_PADDING,
    padding: MODERN_PADDING,
    borderRadius: 10,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  description: {
    fontSize: 13,
    color: COLORS.mediumGray,
    marginVertical: 5,
  },
  applyButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignSelf: 'flex-start',
  },
  appliedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

const videoStyles = StyleSheet.create({
  flatListContainer: {
    paddingVertical: 5,
    paddingHorizontal: MODERN_PADDING,
  },
  videoCard: {
    width: width - MODERN_PADDING * 2,
    height: (width - MODERN_PADDING * 2) * (9 / 16),
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: MODERN_PADDING,
  },
});

const galleryStyles = StyleSheet.create({
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
  },
  imageItem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lastImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  overlayTextSmall: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.white,
  },
});

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: MODERN_PADDING,
    backgroundColor: COLORS.background,
  },
  imagePlaceholder: {
    width: '100%',
    height: width - MODERN_PADDING * 2,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardPlaceholder: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  textLine: {
    width: '80%',
    height: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
});
