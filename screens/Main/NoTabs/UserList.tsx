import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator,
    Image,
    TouchableOpacity,
    RefreshControl, 
    Platform,
    Animated, 
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import userStore from '../../../store/MyStore';

// --- API Service (Assuming BASE_URL is defined somewhere accessible) ---
// Note: You must ensure BASE_URL is defined in your actual project environment.
const BASE_URL = 'YOUR_API_BASE_URL'; // <-- REPLACE THIS WITH YOUR ACTUAL BASE URL


// --- FIX: Create an Animated FlatList component ---
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// --- CONFIGURATION ---
const PAGE_SIZE = 15; 
const HEADER_HEIGHT = 100;

// --- UserListScreen Component ---

export default function UserListScreen() {
    
    const insets = useSafeAreaInsets();
    const route = useRoute();
    const navigation = useNavigation();
    const {SearchUser} = userStore()
    const initialQuery = route.params?.query || ''; 
    const [query, setQuery] = useState(initialQuery); 
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    // --- State for Collapsible Header (using Animated) ---
    const scrollY = useRef(new Animated.Value(0)).current;
    const HEADER_RANGE = HEADER_HEIGHT * 1.5; 
    
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_RANGE],
        outputRange: [0, -HEADER_RANGE],
        extrapolate: 'clamp',
    });

    
    const loadResults = useCallback(async (searchQuery, pageNumber, isRefreshing = false) => {
        
        // This check is redundant here but kept for safety. The primary check is in handleLoadMore.
        // if (!hasMore && pageNumber > 1 && !isRefreshing) return; 

        if (isRefreshing) {
            setRefreshing(true);
        } else if (pageNumber === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            // --- CALL THE REAL API FUNCTION ---
            const data = await SearchUser(searchQuery, PAGE_SIZE, pageNumber);
            
            // Check if we received less than the PAGE_SIZE, indicating the last page
            const isLastPage = data.length < PAGE_SIZE;

            // Functional updates for setResults and setHasMore are not strictly necessary 
            // since 'pageNumber' changes on every load, but are cleaner.
            if (pageNumber === 1) {
                setResults(data); 
            } else {
                setResults(prevResults => [...prevResults, ...data]); 
            }
            
            setHasMore(!isLastPage);
            setPage(pageNumber);

        } catch (error) {
            // The SearchUser function already catches network/parsing errors and returns [],
            // but this block is a fallback/additional error logging point if needed.
            console.error("Critical Load Error in loadResults:", error);
            // On catastrophic failure, ensure UI resets
            setHasMore(false); // Stop trying to load more
            if (pageNumber === 1) setResults([]); // Clear results on initial/refresh failure
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [query]); // <--- FIX: Dependencies now only include 'query' (which can change)
                 // PAGE_SIZE is a constant, no need to include. State setters don't belong here.

   
    useEffect(() => {
        // Reset hasMore and page on new query
        setHasMore(true);
        setPage(1);
        loadResults(query, 1);
    }, [query, loadResults]);


    // --- Handlers ---
    const handleLoadMore = useCallback(() => {
        // Only load more if not currently loading/refreshing AND we think there are more results
        // This check prevents the loop better than checking inside loadResults.
        if (!loadingMore && !refreshing && hasMore) {
            // Use current page state to calculate the next page
            loadResults(query, page + 1);
        }
    }, [loadingMore, refreshing, hasMore, query, page, loadResults]); // Include all external dependencies

    const handleRefresh = useCallback(() => {
        // Reset hasMore before refreshing to ensure we attempt to fetch a full first page
        setHasMore(true); 
        loadResults(query, 1, true); 
    }, [query, loadResults]);

    // --- Render Functions (Rest of the component remains the same) ---
    const renderUserItem = ({ item }) => (
        // <TouchableOpacity style={styles.userItem} onPress={() => alert(`View profile for ${item.username}`)}>
        //     {item.profile ? (
        //         <Image source={{ uri: item.profile }} style={styles.profilePic} />
        //     ) : (
        //         <View style={[styles.profilePic, styles.placeholder]}>
        //             <Text style={styles.placeholderText}>{item.username?.[0] || '?'}</Text>
        //         </View>
        //     )}
        //     <View style={styles.textContainer}>
        //         <Text style={styles.usernameText} numberOfLines={1}>{item.username ?? 'N/A'}</Text>
        //         <Text style={styles.fullnameText} numberOfLines={1}>{item.fullname ?? 'N/A'}</Text>
        //     </View>
        //     <View style={styles.actionButton}>
        //         <Text style={styles.followButtonText}>Follow</Text>
        //     </View>
        // </TouchableOpacity>

  <TouchableOpacity style={styles.suggestionItem} onPress={()=>{
    navigation.navigate('UserScreen', {
      friendId: item._id ,
      accountType : item.accountType
    });
  }}
   >
            <Image source={item.profile ? { uri: item.profile } : require("../../../asset/UserLogo.png" )}  style={styles.profilePic} />
            <View style={styles.textContainer}>
                <Text style={styles.usernameText} numberOfLines={1}>{item.username}</Text>
                <Text style={styles.fullnameText} numberOfLines={1}>{item.fullname}</Text>
            </View>
            <ChevronRight size={18} color="#aaa" />
        </TouchableOpacity>

    );

    const renderListFooter = () => {
        if (loadingMore && hasMore) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.loadingMoreText}>Loading more users...</Text>
                </View>
            );
        }
        
        if (!loadingMore && !hasMore && results.length > 0) {
            return (
                <View style={styles.footerLoader}>
                    <Text style={styles.loadingMoreText}>--- End of results ---</Text>
                </View>
            );
        }

        return null;
    };
    
    const renderHeader = () => (
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }], paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    Users
                </Text>
                <Text style={styles.queryText} numberOfLines={1}>
                    Results for: "{query}"
                </Text>
            </View>
        </Animated.View>
    );


    // --- Main Render ---
    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}> 
            {renderHeader()}

            {loading && page === 1 && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Searching the database...</Text>
                </View>
            ) : results.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.noResultsText}>No matches found for "{query}".</Text>
                </View>
            ) : (
                <AnimatedFlatList
                    data={results}
                    keyExtractor={(item, index) => (item.username || `user-${index}`) + index.toString()} 
                    renderItem={renderUserItem}
                    
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5} 
                    ListFooterComponent={renderListFooter}
                    
                    refreshControl={
                        <RefreshControl
                          progressViewOffset={80}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#007AFF']}
                        />
                    }
                    
                    contentContainerStyle={{ paddingTop: HEADER_HEIGHT }} 
                    scrollEventThrottle={16} 
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                />
            )}
        </View>
    );
}

// --- STYLES (Kept as is for completeness) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        position: 'absolute', 
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        height: HEADER_HEIGHT, 
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
            android: { elevation: 1 },
        }),
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        paddingRight: 10,
        zIndex: 20, 
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute', 
        left: 0,
        right: 0,
        height: HEADER_HEIGHT - 10, 
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700', 
        color: '#333',
    },
    queryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#888',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    profilePic: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 15,
    },
    placeholder: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    usernameText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#333',
    },
    fullnameText: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    actionButton: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    followButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    footerLoader: {
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingMoreText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#888',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    noResultsText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
    }
});