import React, { useState, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    StatusBar,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
    RefreshControl,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    withTiming, // Used for snapping behavior
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import {
    Heart,
    MessageCircle,
    Bookmark,
    Send,
    PlusSquare,
    MoreHorizontal,
    Instagram,
    Search,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// --- CONSTANTS ---
const NAV_BAR_HEIGHT = 50; // Height of the fixed top bar content
const STORIES_HEIGHT = 99; // Height of the stories section

// Correctly determine status bar height for cross-platform compatibility
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 20;

// The combined height of the sticky top bar + status bar space
const STICKY_TOP_BAR_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT; 

// The distance the sticky top bar should move UP (hiding completely)
const COLLAPSIBLE_SECTION_HEIGHT = STICKY_TOP_BAR_HEIGHT; 
const SNAP_THRESHOLD = 10; // Scroll distance threshold to trigger snap

// The total height of the spacer needed in the FlatList (Sticky Top Bar + Stories)
const LIST_HEADER_SPACER_HEIGHT = STICKY_TOP_BAR_HEIGHT + 50;

// --- MOCK DATA (UNCHANGED) ---
const STORIES = [
    { id: 's1', username: 'Your Story', avatar: 'https://via.placeholder.com/60/0000FF/FFFFFF?text=YOU' },
    { id: 's2', username: 'user_a', avatar: 'https://via.placeholder.com/60/FF5733/FFFFFF?text=UA' },
    { id: 's3', username: 'user_b', avatar: 'https://via.placeholder.com/60/33FF57/FFFFFF?text=UB' },
    { id: 's4', username: 'user_c', avatar: 'https://via.placeholder.com/60/3357FF/FFFFFF?text=UC' },
    { id: 's5', username: 'user_d', avatar: 'https://via.placeholder.com/60/FF33A1/FFFFFF?text=UD' },
];

const POSTS = [
    {
        id: 'p1', username: 'creative_coder', realName: 'Alex Johnson',
        text: 'Building beautiful UIs with Reanimated is the future of mobile dev! 🚀 #ReactNative',
        media: [{ id: 'm1a', type: 'image', uri: 'https://picsum.photos/id/10/400/400' }, { id: 'm1b', type: 'image', uri: 'https://picsum.photos/id/20/400/400' }],
        avatar: 'https://via.placeholder.com/40/1E90FF/FFFFFF?text=AJ',
    },
    {
        id: 'p2', username: 'travel_junkie', realName: 'Sarah Lee',
        text: 'Missing this view! Tag someone who needs a vacation. 🏝️',
        media: [{ id: 'm2a', type: 'image', uri: 'https://picsum.photos/id/100/400/400' }, { id: 'm2b', type: 'image', uri: 'https://picsum.photos/id/200/400/400' }, { id: 'm2c', type: 'image', uri: 'https://picsum.photos/id/300/400/400' }],
        avatar: 'https://via.placeholder.com/40/FF4500/FFFFFF?text=SL',
    },
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `p${i + 3}`, username: `mock_user_${i + 1}`, realName: `Mock Person ${i + 1}`,
        text: `Generated post ${i + 1}. The feed is active!`,
        media: [{ id: `m${i}a`, type: 'image', uri: `https://picsum.photos/id/${i + 600}/400/400` }, { id: `m${i}b`, type: 'image', uri: `https://picsum.photos/id/${i + 601}/400/400` }],
        avatar: `https://via.placeholder.com/40/${Math.floor(Math.random() * 16777215).toString(16)}/FFFFFF?text=U${i}`,
    })),
];

// --- 2. PostCard Component (Scrolling Pagination Fix) ---
const PostCard = ({ post }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const renderMediaItem = ({ item }) => (
        <Image source={{ uri: item.uri }} style={postCardStyles.postImage} />
    );

    const handleScroll = (e) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / width);
        setActiveIndex(newIndex);
    };

    return (
        <View style={postCardStyles.cardContainer}>
            {/* Header: Profile & Options (Post Card) */}
            <View style={postCardStyles.cardHeader}>
                <View style={postCardStyles.profileInfo}>
                    <Image source={{ uri: post.avatar }} style={postCardStyles.profilePic} />
                    <View>
                        <Text style={postCardStyles.username}>{post.username}</Text>
                        <Text style={postCardStyles.realName}>{post.realName}</Text>
                    </View>
                </View>
                <TouchableOpacity style={postCardStyles.shareButton}><MoreHorizontal size={24} color="#000" /></TouchableOpacity>
            </View>

            {/* Post Text */}
            {post.text && (<Text style={postCardStyles.postText}>{post.text}</Text>)}

            {/* Media Gallery (Sliding Pagination) */}
            <View style={postCardStyles.mediaContainer}>
                <FlatList
                    data={post.media}
                    renderItem={renderMediaItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                />

                {/* Indicator Dots */}
                {post.media.length > 1 && (
                    <View style={postCardStyles.indicatorContainer}>
                        {post.media.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    postCardStyles.dot,
                                    { backgroundColor: index === activeIndex ? '#3897f0' : '#c7c7c7' }
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* Action Bar: Like, Comment, Save */}
            <View style={postCardStyles.actionBar}>
                <TouchableOpacity style={postCardStyles.actionButton}><Heart size={24} color="#000" /></TouchableOpacity>
                <TouchableOpacity style={postCardStyles.actionButton}><MessageCircle size={24} color="#000" /></TouchableOpacity>
                <TouchableOpacity style={postCardStyles.actionButton}><Send size={24} color="#000" /></TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity><Bookmark size={24} color="#000" /></TouchableOpacity>
            </View>
        </View>
    );
};


// --- 1. Main SocialMediaScreen Component ---
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function Social() {
    const lastScrollY = useRef(0);
    // scrollY now tracks the translation of the sticky NAV BAR
    const scrollY = useSharedValue(0); 
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation()
    // --- Pull-to-Refresh Logic ---
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Ensure the header snaps back down completely when refreshing starts
        scrollY.value = 0; 
        // Simulate data fetch
        await new Promise(resolve => setTimeout(resolve, 2000));
        setRefreshing(false);
    }, []);

    // --- Advanced Snapping Scroll Handler (for Sticky Top Bar) ---
    const scrollHandler = useAnimatedScrollHandler((event) => {
        const y = event.contentOffset.y;
        const diff = y - lastScrollY.current;

        // Scroll down past threshold -> Snap Top Bar UP (hide completely)
        if (y > SNAP_THRESHOLD && diff > 0) {
            // Move UP by the full height of the sticky bar (negative value)
            scrollY.value = withTiming(-COLLAPSIBLE_SECTION_HEIGHT, { duration: 150 }); 
        } 
        // Scroll up/Pull down slightly -> Snap Top Bar DOWN (show completely)
        else if (diff < -5) {
            // Move back to 0
            scrollY.value = withTiming(0, { duration: 250 });
        }
        lastScrollY.current = y;
    });

    // Animated Style for Header Translation
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: scrollY.value }],
        };
    });

    // --- Render Functions ---

    const renderPost = ({ item }) => <PostCard post={item} />;

    const renderStory = ({ item }) => (
        <TouchableOpacity style={screenStyles.storyContainer}>
            <Image source={{ uri: item.avatar }} style={screenStyles.storyCircle} />
            <Text style={screenStyles.storyUsername} numberOfLines={1}>{item.username}</Text>
        </TouchableOpacity>
    );

    // This component now includes the Spacer AND the scrollable Stories FlatList
    const ListHeaderComponent = () => (
        <View>
            {/* 1. SPACER for the Absolute Positioned Sticky Top Bar */}
            <View style={{ height: STICKY_TOP_BAR_HEIGHT }} />

            {/* 2. SCROLLABLE Stories Section */}
            <View style={screenStyles.storiesListWrapper}>
                <FlatList
                    data={STORIES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderStory}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                />
            </View>
        </View>
    );

    return (
        <View style={screenStyles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffffff" translucent />

            {/* Main Content: Post Feed (FlatList) */}
            <AnimatedFlatList
                data={POSTS}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={screenStyles.listContent}
                ListHeaderComponent={ListHeaderComponent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor="#000"
                        // The offset is now the total height of the spacer + stories
                        progressViewOffset={LIST_HEADER_SPACER_HEIGHT} 
                    />
                }
            />

            {/* Sticky/Collapsible Top Bar (Absolute Positioned) */}
            <Animated.View 
                style={[
                    screenStyles.header, 
                    { height: COLLAPSIBLE_SECTION_HEIGHT }, // Ensure height is just the Top Bar
                    headerAnimatedStyle
                ]}
            >

                {/* Fixed Top Bar Content (Includes Status Bar Space) */}
                <View style={screenStyles.topBar}>
                    {/* Status Bar Padding */}
                    <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: '#ffffffff' }} />
                    
                    {/* Navigation Bar Content */}
                    <View style={screenStyles.navBarContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Instagram size={28} color="#000" style={{ marginRight: 8 }} />
                            <Text style={screenStyles.appTitle}>SocialFeed</Text>
                        </View>
                        <View style={screenStyles.topBarActions}>
                            <TouchableOpacity style={screenStyles.actionButton}><PlusSquare size={24} color="#000" /></TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                              navigation.navigate("Screens", {
  screen: "Search"
});

                            }} ><Search size={24} color="#000" /></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

// --- STYLESHEETS ---

// Styles for the main screen structure and header/stories
const screenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingBottom: 20,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        // Using your original colors and borders
        backgroundColor: '#ffffffff', 
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderColor: '#000',
        borderWidth: 1,
        borderBottomColor: '#eee',
    },
    topBar: {
        // topBar now holds the STATUS_BAR_HEIGHT spacer and the nav bar content
        height: '100%', 
        backgroundColor: "#ffffffff", 
    },
    navBarContent: {
        height: NAV_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    appTitle: {
        fontWeight: '800',
        fontSize: 24,
        color: '#333',
    },
    topBarActions: {
        flexDirection: 'row',
        gap : 12,
        paddingRight : 8
    },
    actionButton: {
        marginLeft: 20,
    },
    // New wrapper for the Stories FlatList now that it's in the ListHeaderComponent
    storiesListWrapper: {
        height: STORIES_HEIGHT,
        paddingVertical: 10,
        justifyContent: 'center',
        backgroundColor: '#fff', 
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    storyContainer: {
        alignItems: 'center',
        marginHorizontal: 8,
        width: 60,
    },
    storyCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2.5,
        borderColor: '#FF00A0', // Story ring color
        marginBottom: 4,
    },
    storyUsername: {
        fontSize: 11,
        textAlign: 'center',
        color: '#333',
    },
});

// Styles for the Post Card (UNCHANGED)
const postCardStyles = StyleSheet.create({
    cardContainer: {
        marginBottom: 1,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    username: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 18,
    },
    realName: {
        fontSize: 12,
        color: '#888',
    },
    shareButton: {
        padding: 5,
    },
    postText: {
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#333',
        paddingBottom: 5,
    },
    mediaContainer: {
        width: width,
        height: width,
    },
    postImage: {
        width: width,
        height: '100%',
        resizeMode: 'cover',
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
    actionBar: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    actionButton: {
        marginRight: 20,
    },
});