import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Dimensions,
    Platform,
} from 'react-native';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
} from 'react-native-reanimated';

import {
    Heart,
    Star,
    MapPin,
    Clock3,
    Search,
    Bell,
    Frown,
    Flame,
    MessageCircle,
} from 'lucide-react-native';

import userStore from "../../../store/MyStore";
import { useNavigation } from '@react-navigation/native';

const HEADER_HEIGHT = 210;
const SNAP_THRESHOLD = 80;
const STORES_PER_PAGE = 10;
const { width } = Dimensions.get('screen');

const CATEGORY_CHIPS = ['All', 'Trending', 'Recommended', 'Custom'];

// Skeleton
const StoreCardSkeleton = () => {
    const opacity = useSharedValue(0.3);
    useEffect(() => {
        opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <View style={storeStyles.cardContainer}>
            <Animated.View style={[storeStyles.skeletonImage, animatedStyle]} />
            <View style={storeStyles.skeletonDetails}>
                <Animated.View style={[storeStyles.skeletonTitle, animatedStyle]} />
                <Animated.View style={[storeStyles.skeletonLine, animatedStyle, { width: '70%' }]} />
                <Animated.View style={[storeStyles.skeletonLine, animatedStyle, { width: '50%' }]} />
            </View>
        </View>
    );
};




const EmptyState = ({ message }) => (
    <View style={homeStyles.emptyStateContainer}>
        <Frown size={80} color="#d1d5db" />
        <Text style={homeStyles.emptyStateText}>{message}</Text>
    </View>
);




const StoreCard = React.memo(({ store, onPress }) => {
    const isOpen = store.Is24Hours || (() => {
        if (!store.OpeningTime || !store.ClosingTime) return false;
        const [oh, om] = store.OpeningTime.split(':').map(Number);
        const [ch, cm] = store.ClosingTime.split(':').map(Number);
        const openMins = oh * 60 + om;
        const closeMins = ch * 60 + cm;
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        return openMins < closeMins
            ? currentMins >= openMins && currentMins < closeMins
            : currentMins >= openMins || currentMins < closeMins;
    })();

    const rating = parseFloat(store.TotalRatings || 0);

    return (
        <TouchableOpacity style={storeStyles.cardContainer} activeOpacity={0.9} onPress={() => onPress(store)}>
            <View style={storeStyles.imageWrapper}>
                <Image source={{ uri: store.coverImage || "https://picsum.photos/400/300" }} style={storeStyles.storeImage} />
                <View style={[storeStyles.statusBadge, { backgroundColor: isOpen ? '#10b981' : '#ef4444' }]}>
                    <View style={storeStyles.statusDot} />
                    <Text style={storeStyles.statusText}>{isOpen ? "OPEN" : "CLOSED"}</Text>
                </View>
            </View>

            <View style={storeStyles.detailsContainer}>
                <Text style={storeStyles.storeName} numberOfLines={2}>{store.StoreName}</Text>
                <View style={storeStyles.ratingRow}>
                    <View style={storeStyles.ratingStars}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} color="#fbbf24" fill={i < Math.floor(rating) ? "#fbbf24" : "transparent"} strokeWidth={1.8} />
                        ))}
                    </View>
                    <Text style={storeStyles.ratingCount}>{rating.toFixed(1)}</Text>
                </View>
                <View style={storeStyles.infoRow}>
                    <Clock3 size={15} color="#6b7280" />
                    <Text style={storeStyles.infoText}>
                        {store.Is24Hours ? "24 Hours" : `${store.OpeningTime} - ${store.ClosingTime}`}
                    </Text>
                </View>
                <View style={storeStyles.infoRow}>
                    <MapPin size={15} color="#6b7280" />
                    <Text style={storeStyles.infoText} numberOfLines={1}>
                        {store.address?.addressLine2?.split(",")[0] || "Location unavailable"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});



const TrendingCard = React.memo(({ product }) => {
    const navigation = useNavigation();
    return (
       <TouchableOpacity
  style={productStyles.trendingCard}
  onPress={() => {
    
    navigation.navigate('Screens', {
  screen: 'ProductDetail',
  params: {
    productId: product.Parent,
    varientId: product._id,
  },
});




  }}
>
            <Image source={{ uri: product.coverImage }} style={productStyles.trendingImage} />
            <View style={productStyles.likesBadge}>
                <Heart size={14} color="#fff" fill="#fff" />
                <Text style={productStyles.likesText}>{product.TotalLikes}</Text>
            </View>
            <View style={productStyles.trendingIcon}>
                <Flame size={18} color="#fb4631" />
            </View>
            <View style={productStyles.infoSection}>
                <Text style={productStyles.trendingName} numberOfLines={1}>{product.ProductName}</Text>
                <Text style={productStyles.trendingPrice}>₹{product.ProductPrice}</Text>
            </View>
        </TouchableOpacity>
    );
});



const CategoryTray = React.memo(({ selectedCategory, onSelectCategory }) => (
    <View style={homeStyles.categoryContainer}>
        <FlatList
            data={CATEGORY_CHIPS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            contentContainerStyle={homeStyles.categoryTray}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[homeStyles.categoryChip, item === selectedCategory && homeStyles.categoryChipSelected]}
                    onPress={() => onSelectCategory(item)}
                >
                    <Text style={[homeStyles.categoryText, item === selectedCategory && homeStyles.categoryTextSelected]}>
                        {item}
                    </Text>
                </TouchableOpacity>
            )}
        />
    </View>
));

const CollapsibleHeader = React.memo(({ headerTranslateY, selectedCategory, handleCategorySelect }) => {
    const navigation  = useNavigation()
    const insets = useSafeAreaInsets();
    const {userModelID} = userStore();
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: headerTranslateY.value }],
    }));

    return (
        <Animated.View style={[homeStyles.header, animatedStyle]}>
            <View style={{ height: insets.top }} />
            <View style={homeStyles.expandedHeader}>
                <View style={homeStyles.topRow}>
                    <View style={homeStyles.profileSection}>
                        <Image source={{ uri: 'https://picsum.photos/seed/profile/50' }} style={homeStyles.profileImage} />
                        <View>
                            <Text style={homeStyles.greetingText}>Hi Rachit</Text>
                            <View style={homeStyles.locationRow}>
                                <MapPin size={12} color="#6b7280" />
                                <Text style={homeStyles.locationText}>All Stores</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[ {display : 'flex' , flexDirection : 'row' , gap : 10}]}>
                        <TouchableOpacity onPress={()=>{
                            
                    navigation.navigate('Screens', {
                        screen: 'Users'})
                        }} style = {homeStyles.notificationButton}>
<Bell size={24} color="#111827" />
  <View style={homeStyles.notificationBadge} />
                        </TouchableOpacity>
                        
                       <TouchableOpacity onPress={()=>{

                    navigation.navigate('Screens', {
                        screen: 'Chats',
                                    params: {
                            friendId: "692afe8481a7b1a32b7a4547"
                                              }
                      });
                       }}  style = {homeStyles.notificationButton}>
<MessageCircle size={24} color="#111827" />
  <View style={homeStyles.notificationBadge} />
                        </TouchableOpacity>
                      
                    </View>
                     
                </View>
                <TouchableOpacity style={homeStyles.searchBar}>
                    <Search size={20} color="#9ca3af" />
                    <Text style={homeStyles.searchInput}>Search stores, products...</Text>
                </TouchableOpacity>
            </View>
            <CategoryTray selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
        </Animated.View>
    );
});

const HomeScreen = () => {
    const { loadAllStore, loadTrendingProduct , userModelID } = userStore();
    const navigation = useNavigation();

    const [stores, setStores] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [category, setCategory] = useState('All');
    const [loadingMore, setLoadingMore] = useState(false);

    const headerY = useSharedValue(0);
    const lastScrollY = useRef(0);

    // Fetch 10 trending products
    useEffect(() => {
        loadTrendingProduct(1, 10)
            .then(res => {
                if (res?.success) setTrending(res.TrendingProductList || []);
            })
            .catch(() => setTrending([]));
    }, []);

    const fetchStores = useCallback(async (pageNum = 1, isRefresh = false) => {
        if (category !== 'All') return;
        if (pageNum !== 1 && (loadingMore || !hasMore)) return;

        if (pageNum === 1) {
            isRefresh ? setRefreshing(true) : setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const res = await loadAllStore(pageNum);
            if (res?.success) {
                const newStores = res.StoreList || [];
                setStores(prev => pageNum === 1 ? newStores : [...prev, ...newStores]);
                setHasMore(newStores.length === STORES_PER_PAGE);
                setPage(pageNum);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
            setHasMore(false);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [category, loadAllStore, loadingMore, hasMore]);

    useEffect(() => {
        setStores([]);
        setPage(1);
        setHasMore(true);
        if (category === 'All') fetchStores(1);
    }, [category]);

    const handleScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const diff = y - lastScrollY.current;

        if (y > SNAP_THRESHOLD && diff > 0) {
            headerY.value = withTiming(-HEADER_HEIGHT, { duration: 300 });
        } else if (diff < -10) {
            headerY.value = withTiming(0, { duration: 300 });
        }
        lastScrollY.current = y;
    };

    const keyExtractor = useCallback((item) => item._id.toString(), []);
    const renderItem = useCallback(({ item }) => (
        <View style={homeStyles.contentContainer}>
            <StoreCard store={item} onPress={() => {}} />
        </View>
    ), []);

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <View style={homeStyles.container}>
                <CollapsibleHeader
                    headerTranslateY={headerY}
                    selectedCategory={category}
                    handleCategorySelect={(cat) => {
                        setCategory(cat);
                        headerY.value = withTiming(0);
                    }}
                />

                <FlatList
                    data={category === 'All' ? stores : []}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}

                    // Removed getItemLayout → fixes flicker!
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                    windowSize={21}
                    removeClippedSubviews={true}

                    onEndReached={() => {
                        if (category === 'All' && hasMore && !loadingMore) {
                            fetchStores(page + 1);
                        }
                    }}
                    onEndReachedThreshold={0.6}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchStores(1, true)}
                            colors={['#111827']}
                            tintColor="#111827"
                            progressViewOffset={HEADER_HEIGHT + 80}   // Critical: Makes spinner visible!
                            title="Refreshing stores..."
                            titleColor="#6b7280"
                        />
                    }

                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}

                    ListHeaderComponent={
                        <>
                            {category === 'All' && (
                                <View style={[homeStyles.contentContainer, { paddingTop: 6 }]}>
                                    <View style={homeStyles.sectionRow}>
                                        <Text style={homeStyles.sectionTitle}>Trending Products</Text>
                                        <TouchableOpacity onPress={() => navigation.push("/(main)/(Notabs)/TrendingProduct")}>
                                            <Text style={homeStyles.viewAllText}>View All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 }}>
                                        {trending.map(p => (
                                            <TrendingCard key={p._id} product={p} />
                                        ))}
                                    </View>
                                </View>
                            )}

                            <View style={[homeStyles.contentContainer, { paddingTop: 20 }]}>
                                <Text style={homeStyles.sectionTitle}>
                                    All Stores ({stores.length})
                                </Text>
                            </View>

                            {loading && stores.length === 0 && (
                                <View style={homeStyles.contentContainer}>
                                    {[...Array(6)].map((_, i) => <StoreCardSkeleton key={i} />)}
                                </View>
                            )}
                        </>
                    }

                    ListEmptyComponent={<EmptyState message="No stores found" />}

                    ListFooterComponent={
                        loadingMore ? (
                            <View style={homeStyles.footerLoader}>
                                <ActivityIndicator size="small" color="#111827" />
                                <Text style={homeStyles.footerText}>Loading more stores...</Text>
                            </View>
                        ) : !hasMore && stores.length > 0 ? (
                            <View style={homeStyles.footerEnd}>
                                <Text style={homeStyles.footerEndText}>You've reached the end</Text>
                            </View>
                        ) : null
                    }

                    contentContainerStyle={{
                        paddingTop: HEADER_HEIGHT + 10,
                        paddingBottom: 120,
                    }}
                />
            </View>
        </SafeAreaProvider>
    );
};


// --- Styles ---
const homeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: '#fff', height: HEADER_HEIGHT,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
    },
    expandedHeader: { paddingHorizontal: 16, paddingBottom: 10 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    profileSection: { flexDirection: 'row', alignItems: 'center' },
    profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    greetingText: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    locationText: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginLeft: 4 },
    notificationButton: { padding: 8, borderRadius: 20, backgroundColor: '#f3f4f6', position: 'relative' },
    notificationBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 12 : 10 },
    searchInput: { marginLeft: 10, fontSize: 15, flex: 1 },
    categoryContainer: { paddingVertical: 10 },
    categoryTray: { paddingHorizontal: 16, paddingTop: 5, paddingBottom: 15 },
    categoryChip: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, borderWidth: 1, borderColor: '#e5e7eb' },
    categoryChipSelected: { backgroundColor: '#1f2937', borderColor: '#1f2937' },
    categoryText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
    categoryTextSelected: { color: '#fff' },
    contentContainer: { paddingHorizontal: 16, backgroundColor: '#f9fafb' },
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
    viewAllText: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
    footerLoader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
    footerText: { marginLeft: 8, fontSize: 14, color: '#6b7280' },
    footerEnd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
    footerEndText: { fontSize: 13, color: '#9ca3af', marginHorizontal: 10 },
    divider: { height: 1, backgroundColor: '#e5e7eb', width: '25%' },
    emptyStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
    emptyStateText: { marginTop: 15, fontSize: 16, color: '#9ca3af', textAlign: 'center', fontWeight: '600' },
});

const storeStyles = StyleSheet.create({
    cardContainer: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6, borderWidth: 1, borderColor: '#f1f1f1' },
    imageWrapper: { position: 'relative' },
    storeImage: { width: '100%', height: 200, resizeMode: 'cover' },
    statusBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginRight: 6 },
    statusText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    detailsContainer: { padding: 16 },
    storeName: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    ratingStars: { flexDirection: 'row', marginRight: 6 },
    ratingCount: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    infoText: { fontSize: 13.5, color: '#4b5563', marginLeft: 6, flex: 1 },
    skeletonImage: { width: '100%', height: 200, backgroundColor: '#e5e7eb', borderRadius: 16 },
    skeletonDetails: { padding: 16 },
    skeletonTitle: { height: 20, width: '80%', backgroundColor: '#e5e7eb', borderRadius: 8, marginBottom: 12 },
    skeletonLine: { height: 16, backgroundColor: '#e5e7eb', borderRadius: 8, marginBottom: 10 },
});

const productStyles = StyleSheet.create({
    trendingCard: { width: (width / 2) - 24, marginBottom: 16, backgroundColor: '#fff', borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, overflow: 'hidden' },
    trendingImage: { width: '100%', height: 120, backgroundColor: '#f3f4f6', resizeMode: 'cover' },
    likesBadge: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3 },
    likesText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    trendingIcon: { position: 'absolute', top: 8, left: 8, backgroundColor: '#fee2e2', borderRadius: 10, padding: 4 },
    infoSection: { padding: 8 },
    trendingName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
    trendingPrice: { fontSize: 16, fontWeight: '800', color: '#1f2937' },
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6', marginTop: 4, paddingTop: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    trendingRatingText: { marginLeft: 4, fontSize: 12, color: '#4b5563' },
    quantityText: { fontSize: 12, color: '#9ca3af' },
});

export default HomeScreen;