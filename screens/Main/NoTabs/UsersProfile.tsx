// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import { 
//     View, 
//     Text, 
//     FlatList, // Used inside ScrollView for grid display
//     StyleSheet, 
//     ActivityIndicator,
//     Image,
//     TouchableOpacity,
//     Dimensions,
//     Alert,
//     RefreshControl,
//     Animated,
//     ScrollView, // Base ScrollView for main container
// } from 'react-native';
// import { ChevronLeft, Lock, Users, MessageSquare } from 'lucide-react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
// import { useNavigation, useRoute } from '@react-navigation/native';
// import userStore from '../../../store/MyStore'; // Assuming this path is correct

// // --- Constants ---
// const windowWidth = Dimensions.get('window').width;
// const POST_COLUMNS = 3;
// const POST_SIZE = windowWidth / POST_COLUMNS;
// const PAGE_SIZE = 12;

// // Use Animated ScrollView for main container to potentially add scroll effects later
// const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// // --- DUMMY DATA AND MOCK API ---

// const PUBLIC_USER_DATA = {
//     username: 'react_dev_pro',
//     fullname: 'React Native Pro',
//     bio: 'Mobile App Developer | Open Source Enthusiast 💻',
//     profilePic: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=R',
//     connectionCount: 5200,
//     accountType: 'public',
// };

// const PRIVATE_USER_DATA = {
//     username: 'private_coder',
//     fullname: 'Private Coder',
//     bio: 'Secured Mobile Apps Only.',
//     profilePic: 'https://via.placeholder.com/150/FF007A/FFFFFF?text=P',
//     connectionCount: 1200,
//     accountType: 'private',
// };

// const ALL_MOCK_POSTS = Array.from({ length: 100 }, (_, i) => ({
//     id: `post_${i + 1}`,
//     imageUrl: `https://picsum.photos/id/${i + 10}/200/200`,
//     key: `post-${i + 1}` 
// }));

// const mockFetchPosts = async (page) => {
//     await new Promise(resolve => setTimeout(resolve, 800));
//     const startIndex = (page - 1) * PAGE_SIZE;
//     const endIndex = startIndex + PAGE_SIZE;
//     return ALL_MOCK_POSTS.slice(startIndex, endIndex);
// };


// // --- COMPONENTS (No change to components, omitting for brevity) ---
// const ProfileHeader = ({ username, insets,navigation }) => (
    

//     // Header is positioned absolutely over the ScrollView
//     <View style={[styles.header, { paddingTop: insets.top }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <ChevronLeft size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle} numberOfLines={1}>{username}</Text>
//         <View style={{ width: 40 }} />
//     </View>
// );

// const UserDetails = React.memo(({ user, isConnected, onConnectPress, onMessagePress }) => {
//     const isPublic = user.accountType === 'public';
//     const postCount = user.accountType === 'public' || isConnected ? 12 : 0;
    
//     return (
//         <View style={styles.detailsContainer}>
//             <View style={styles.profileSummary}>
//                 <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
//                 <View style={styles.statsContainer}>
//                     <View style={styles.statItem}>
//                         <Text style={styles.statNumber}>{postCount}</Text>
//                         <Text style={styles.statLabel}>Posts</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                         <Text style={styles.statNumber}>{user.connectionCount.toLocaleString()}</Text>
//                         <Text style={styles.statLabel}>Connections</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                         <Text style={styles.statNumber}>80</Text>
//                         <Text style={styles.statLabel}>Following</Text>
//                     </View>
//                 </View>
//             </View>

//             <View style={styles.nameBioContainer}>
//                 <Text style={styles.fullnameText}>{user.fullname}</Text>
//                 <Text style={styles.bioText}>{user.bio}</Text>
                
//                 <Text style={styles.connectionCountText}>
//                     Total Connections:
//                     <Text style={{ fontWeight: 'bold', color: '#333' }}>
//                         {' '}{user.connectionCount.toLocaleString()}
//                     </Text>
//                 </Text>
//             </View>

//             <View style={styles.actionsRow}>
//                 {isConnected ? (
//                     <>
//                         <TouchableOpacity style={[styles.actionButton, styles.connectedButton]} 
//                             onPress={() => Alert.alert('Connection Menu')}>
//                             <Users size={16} color="#333" style={{ marginRight: 5 }} />
//                             <Text style={styles.connectedButtonText}>Connected</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={[styles.actionButton, styles.messageButton]} 
//                             onPress={onMessagePress}>
//                             <MessageSquare size={16} color="#fff" style={{ marginRight: 5 }} />
//                             <Text style={styles.messageButtonText}>Message</Text>
//                         </TouchableOpacity>
//                     </>
//                 ) : (
//                     <TouchableOpacity style={[styles.actionButton, styles.connectButton]} 
//                         onPress={onConnectPress}>
//                         <Text style={styles.connectButtonText}>{isPublic ? 'Connect' : 'Request Connection'}</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </View>
//     );
// });

// const PostGridItem = React.memo(({ item }) => (
//     <TouchableOpacity style={styles.postItem} onPress={() => Alert.alert(`View post ${item.id}`)}>
//         <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
//     </TouchableOpacity>
// ));

// const PrivateViewPlaceholder = ({ user }) => (
//     <View style={styles.privateViewContainer}>
//         <Lock size={50} color="#888" />
//         <Text style={styles.privateTitle}>{user.username}'s Account is Private</Text>
//         <Text style={styles.privateSubtitle}>Connect to see their posts and activity.</Text>
//     </View>
// );

// const PostsFooter = ({ isLoadingMore }) => (
//     isLoadingMore ? (
//         <View style={styles.postFooterLoader}>
//             <ActivityIndicator size="small" color="#555" />
//         </View>
//     ) : null
// );

// const EmptyPosts = () => (
//     <View style={styles.centerTextContainer}>
//         <Text style={styles.emptyText}>No posts yet.</Text>
//     </View>
// );
// // --- MAIN SCREEN COMPONENT ---

// export default function NewUserProfileScreen() {
//     const insets = useSafeAreaInsets();
//     const route = useRoute();
    
//     // Get the ID of the friend being viewed
//     const { friendId , accountType} = route.params; 
//     const navigation = useNavigation();
    
//     // 🔑 Fetch the Zustand action
//     const { handleConnectionRequest , CheckUserProfile} = userStore(); 

//     // Local state for profile view simulation
//     const [isPublicState, setIsPublicState] = useState(true);
//     const [isConnected, setIsConnected] = useState(false);
//     const [isRequestPending, setIsRequestPending] = useState(false); // New state for pending request

//     // Choose user data based on state
//     const user = isPublicState ? PUBLIC_USER_DATA : PRIVATE_USER_DATA;
//     const isPublic = accountType === 'public';

//     const [posts, setPosts] = useState([]);
//     const [page, setPage] = useState(1);
//     const [loadingPosts, setLoadingPosts] = useState(false);
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const [hasMorePosts, setHasMorePosts] = useState(true);

//     const isMounted = useRef(true);
//     const scrollRef = useRef(null); // Ref for ScrollView

//     const loadPosts = useCallback(async (pageNumber, isRefresh = false) => {
//         // Only load if public or connected
//         if (!isPublic && !isConnected) return;
        
//         // **Fix for Infinite Loop / Concurrent Calls**: Check loading state first
//         if (loadingPosts || isRefreshing) return;

//         if (isRefresh) {
//             setIsRefreshing(true);
//         } else {
//             setLoadingPosts(true);
//         }

//         try {
//             const data = await mockFetchPosts(pageNumber);
            
//             if (isMounted.current) {
//                 const isLastPage = data.length < PAGE_SIZE;
                
//                 setPosts(prevPosts => pageNumber === 1 ? data : [...prevPosts, ...data]);
//                 setHasMorePosts(!isLastPage);
//                 setPage(pageNumber);
//             }
//         } catch (error) {
//             console.error("Failed to load posts:", error);
//             if (isMounted.current) Alert.alert("Error", "Failed to load posts.");
//         } finally {
//             if (isMounted.current) {
//                 setLoadingPosts(false);
//                 setIsRefreshing(false);
//             }
//         }
//     }, [isPublic, isConnected]); 

     
//     useEffect(() => {
//         isMounted.current = true;
//         // Reset and load only if content is visible
//         if (isPublic || isConnected) {
//             setPosts([]);
//             setPage(1);
//             setHasMorePosts(true);
//             loadPosts(1);
//         }
//         return () => {
//             isMounted.current = false;
//         };
//     }, [isPublic, isConnected, loadPosts]);

//     const handleRefresh = useCallback(() => {
//         setPosts([]);
//         setHasMorePosts(true);
//         loadPosts(1, true);
//     }, [loadPosts ]);


//     // 🔑 UPDATED handleConnectPress to use Zustand
//     const handleConnectPress = useCallback(async () => {

//         const reqType = 'Following';
         
        
//         // Disable repeated presses while loading
//         if (isRequestPending) return;

//         setIsRequestPending(true);

//         try {
//             const result = await handleConnectionRequest(
//                 accountType,
//                 friendId,
//                 reqType,
//             );

//             if (result.success) {
//                 // Alert.alert("Success", result.msg);
                
//                 // If the account is Public, the connection is immediate.
//                 if (accountType === 'public') {
//                     setIsConnected(true);
//                     // Since posts are visible now, trigger a load (or rely on useEffect)
//                     loadPosts(1, true); 
//                 } 
//                 // If the account is Private, the result is "Requested Successfully", 
//                 // so we don't set isConnected but perhaps show a "Request Pending" state if implemented.

//             } else {
//                 Alert.alert("Request Failed", result.msg || "Could not complete the connection request.");
//             }
//         } catch (error) {
//             console.error("Connection attempt failed:", error);
//             Alert.alert("Error", "An unexpected error occurred during connection.");
//         } finally {
//             setIsRequestPending(false);
//         }

//     }, [handleConnectionRequest, friendId, user.accountType, isRequestPending, loadPosts]);


//     const handleMessagePress = () => {
//         Alert.alert(`Message`, `Opening chat with ${user.username}.`);
//     };

   

//     // This is the core logic that determines what the user sees
//     const showPosts = isPublic || isConnected;
//     const showEmptyState = !isRefreshing && !loadingPosts && posts.length === 0;

//     return (
//         <View style={styles.container}>
//             {/* Absolute Header */}
//             <ProfileHeader username={user.username} insets={insets} navigation = {navigation}/>

//             {/* Main Content Scroll View */}
//             <AnimatedScrollView
//                 ref={scrollRef}
//                 style={styles.contentScroll} // Correctly handles paddingTop for the absolute header
//                 contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} // Extra padding for the fixed button
//                 showsVerticalScrollIndicator={false}
//                 // Pull-to-refresh control handles refresh logic for the entire screen
//                 refreshControl={
//                     <RefreshControl 
//                         refreshing={isRefreshing} 
//                         onRefresh={handleRefresh} 
//                         colors={['#007AFF']}
//                     />
//                 }
//             >
//                 {/* 1. Profile Details */}
//                 <UserDetails 
//                     user={user} 
//                     isConnected={isConnected} 
//                     onConnectPress={handleConnectPress}
//                     onMessagePress={handleMessagePress}
//                 />
                
//                 <View style={styles.divider} />

//                 {/* 2. Posts or Private Placeholder */}
                
//                 {showPosts ? (
//                     // This section uses a FlatList nested inside a ScrollView, 
//                     // which requires `scrollEnabled={false}` for performance and avoiding double-scrolling.
//                     <View style={styles.postGridContainer}>
//                         <FlatList
//                             data={posts}
//                             keyExtractor={item => item.key}
//                             renderItem={({ item }) => <PostGridItem item={item} />}
//                             numColumns={POST_COLUMNS}
//                             scrollEnabled={false} // CRITICAL: Disable inner scroll
//                             ListEmptyComponent={showEmptyState ? EmptyPosts : null}
//                         />
//                         <PostsFooter 
//                             // Only show loader if we are loading and we have existing posts (page > 1)
//                             isLoadingMore={loadingPosts && page > 1}
//                         />

//                         {/* Implement EndReached manually when inside ScrollView */}
//                         {hasMorePosts && !loadingPosts && !isRefreshing && (
//                             <TouchableOpacity 
//                                 style={styles.loadMoreButton}
//                                 onPress={() => loadPosts(page + 1)}
//                                 disabled={loadingPosts}
//                             >
//                                 <Text style={styles.loadMoreText}>Load More Posts</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 ) : (
//                     <PrivateViewPlaceholder user={user} />
//                 )}
//             </AnimatedScrollView>
            
            
//         </View>
//     );
// }

// // --- STYLES (Omitted for brevity) ---
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     // The ScrollView takes up all available space and applies the necessary top offset
//     contentScroll: {
//         flex: 1,
//         paddingTop: 100, // Space for the absolute header (insets.top + 50)
//     },
    
//     // Header Styles (Absolute)
//     header: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//         height: 100, 
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//         paddingHorizontal: 15,
//     },
//     backButton: {
//         paddingRight: 15,
//     },
//     headerTitle: {
//         flex: 1,
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#333',
        
//     },

//     // User Details Styles
//     detailsContainer: {
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//     },
//     profileSummary: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 15,
//     },
//     profilePic: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         borderWidth: 2,
//         borderColor: '#eee',
//         marginRight: 20,
//     },
//     statsContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//     },
//     statItem: {
//         alignItems: 'center',
//     },
//     statNumber: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#333',
//     },
//     statLabel: {
//         fontSize: 13,
//         color: '#888',
//         marginTop: 2,
//     },
//     nameBioContainer: {
//         marginBottom: 15,
//     },
//     fullnameText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 5,
//     },
//     bioText: {
//         fontSize: 14,
//         color: '#555',
//         marginBottom: 5,
//     },
//     connectionCountText: {
//         fontSize: 13,
//         color: '#888',
//         fontWeight: '500',
//     },
//     actionsRow: {
//         flexDirection: 'row',
//         width: '100%',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     actionButton: {
//         paddingVertical: 8,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'row',
//         marginHorizontal: 4,
//     },
//     connectButton: {
//         backgroundColor: '#007AFF',
//         flex: 1,
//         marginHorizontal: 0, 
//     },
//     connectButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//         fontSize: 15,
//     },
//     connectedButton: {
//         backgroundColor: '#eee',
//         flex: 0.5,
//     },
//     connectedButtonText: {
//         color: '#333',
//         fontWeight: '600',
//         fontSize: 15,
//     },
//     messageButton: {
//         backgroundColor: '#333',
//         flex: 0.5,
//     },
//     messageButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//         fontSize: 15,
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#eee',
//         marginBottom: 10,
//     },

//     // Post Grid Styles
//     postGridContainer: {
//         // Contains the FlatList and Load More button/loader
//     },
//     postItem: {
//         width: POST_SIZE,
//         height: POST_SIZE,
//         padding: 0,
//         borderWidth: 1,
//         borderColor: '#fff', 
//     },
//     postImage: {
//         width: '100%',
//         height: '100%',
//     },
//     postFooterLoader: {
//         paddingVertical: 20,
//         alignItems: 'center',
//     },
//     loadMoreButton: {
//         padding: 15,
//         backgroundColor: '#f0f0f0',
//         alignItems: 'center',
//         marginHorizontal: 15,
//         borderRadius: 8,
//         marginVertical: 10,
//     },
//     loadMoreText: {
//         color: '#007AFF',
//         fontWeight: '600',
//     },

//     // Private View Styles
//     privateViewContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 50,
//         paddingHorizontal: 20,
//     },
//     privateTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#555',
//         marginTop: 15,
//         textAlign: 'center',
//     },
//     privateSubtitle: {
//         fontSize: 14,
//         color: '#888',
//         marginTop: 5,
//         textAlign: 'center',
//     },
//     centerTextContainer: {
//         flex: 1,
//         minHeight: 150, // Added minHeight so the empty message is visible
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     emptyText: {
//         color: '#888',
//         fontSize: 16,
//     },
    
   
// });


import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
  Animated,
  ScrollView,
} from 'react-native';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import userStore from '../../../store/MyStore';

const windowWidth = Dimensions.get('window').width;
const POST_COLUMNS = 3;
const POST_SIZE = windowWidth / POST_COLUMNS;
const PAGE_SIZE = 12;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// MOCK PUBLIC + PRIVATE – replace with real user fetched from backend
const PUBLIC_USER_DATA = {
  username: 'react_dev_pro',
  fullname: 'React Native Pro',
  bio: 'Mobile App Developer | Open Source Enthusiast 💻',
  profilePic: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=R',
  connectionCount: 5200,
};

const PRIVATE_USER_DATA = {
  username: 'private_coder',
  fullname: 'Private Coder',
  bio: 'Secured Mobile Apps Only.',
  profilePic: 'https://via.placeholder.com/150/FF007A/FFFFFF?text=P',
  connectionCount: 1200,
};

const ALL_MOCK_POSTS = Array.from({ length: 100 }, (_, i) => ({
  id: `post_${i + 1}`,
  imageUrl: `https://picsum.photos/id/${i + 10}/200/200`,
  key: `post-${i + 1}`,
}));

const mockFetchPosts = async (page) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  return ALL_MOCK_POSTS.slice(startIndex, endIndex);
};

// ----------------- COMPONENTS -----------------
const ProfileHeader = ({ username, insets, navigation }) => (
  <View style={[styles.header, { paddingTop: insets.top }]}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <ChevronLeft size={24} color="#333" />
    </TouchableOpacity>
    <Text style={styles.headerTitle} numberOfLines={1}>
      {username}
    </Text>
    <View style={{ width: 40 }} />
  </View>
);

const UserDetails = React.memo(
  ({ user, statusFlags, isSelf, onPrimaryPress, onMessagePress, onEditProfile }) => {
    const { isConnected, isPending, canFollowBack } = statusFlags;
    const postCount = isConnected || user?.accountType === 'public' || isSelf ? 12 : 0;

    const getPrimaryLabel = () => {
      if (isSelf) return 'Edit Profile';
      if (isConnected) return 'Unfollow';
      if (canFollowBack) return 'Accept';
      if (isPending) return 'Requested'; // tap again -> cancel
      return 'Connect';
    };

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.profileSummary}>
          <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{postCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {(user?.connectionCount ?? 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
          </View>
        </View>

        <View style={styles.nameBioContainer}>
          <Text style={styles.fullnameText}>{user.fullname}</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isSelf
                ? styles.connectedButton
                : isConnected
                ? styles.connectedButton
                : styles.connectButton,
            ]}
            onPress={isSelf ? onEditProfile : onPrimaryPress}
          >
            <Text
              style={
                isSelf || isConnected
                  ? styles.connectedButtonText
                  : styles.connectButtonText
              }
            >
              {getPrimaryLabel()}
            </Text>
          </TouchableOpacity>

          {!isSelf && isConnected && (
            <TouchableOpacity
              style={[styles.actionButton, styles.messageButton]}
              onPress={onMessagePress}
            >
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

const PostGridItem = React.memo(({ item }) => (
  <TouchableOpacity style={styles.postItem}>
    <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
  </TouchableOpacity>
));

const PrivateViewPlaceholder = ({ user }) => (
  <View style={styles.privateViewContainer}>
    <Lock size={50} color="#888" />
    <Text style={styles.privateTitle}>{user.username}'s Account is Private</Text>
    <Text style={styles.privateSubtitle}>Connect to see posts.</Text>
  </View>
);

const PostsFooter = ({ isLoadingMore }) =>
  isLoadingMore ? (
    <View style={styles.postFooterLoader}>
      <ActivityIndicator size="small" color="#555" />
    </View>
  ) : null;

// ----------------- MAIN SCREEN -----------------
export default function NewUserProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const { friendId, accountType, isSelf = false } = route.params;

  const { handleConnectionRequest, checkUserProfile, userModelID, currentUser } =
    userStore();

  const [statusFlags, setStatusFlags] = useState({
    isConnected: false,
    isPending: false,
    canFollowBack: false,
  });

  const [user, setUser] = useState(
    accountType === 'private' ? PRIVATE_USER_DATA : PUBLIC_USER_DATA
  );
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const scrollRef = useRef(null);

  // -------- Load profile status --------
  const loadProfileStatus = useCallback(async () => {
    try {
      if (isSelf) {
        // For own profile, no follow state
        setStatusFlags({
          isConnected: false,
          isPending: false,
          canFollowBack: false,
        });

        // Use your logged-in user data instead of MOCK
        if (currentUser) {
          setUser({
            username: currentUser.username,
            fullname: currentUser.fullname,
            bio: currentUser.bio,
            profilePic: currentUser.profilePic,
            connectionCount: currentUser.connectionCount ?? 0,
            accountType: currentUser.accountType,
          });
        }
        return;
      }

      const res = await checkUserProfile(friendId, accountType === 'public' ? 'Public' : 'Private');

      setStatusFlags({
        isConnected: res.status === 'Following',
        isPending: res.status === 'Requested',
        canFollowBack: res.status === 'FollowBack' || res.status === 'Accept',
      });

      // Set user details – in real app you should fetch it from backend
      setUser(
        accountType === 'private'
          ? { ...PRIVATE_USER_DATA, accountType: 'private' }
          : { ...PUBLIC_USER_DATA, accountType: 'public' }
      );
    } catch (err) {
      console.log(err);
    }
  }, [friendId, accountType, isSelf, currentUser]);

  useEffect(() => {
    loadProfileStatus();
  }, [loadProfileStatus]);

  // -------- Load posts (public or connected or self) --------
  const loadPosts = useCallback(
    async (pageNumber, isRefresh = false) => {
      const isPublic = accountType === 'public';
      const allowed =
        isSelf || isPublic || (!isPublic && statusFlags.isConnected);

      if (!allowed) return;
      if (loadingPosts) return;

      isRefresh ? setIsRefreshing(true) : setLoadingPosts(true);

      try {
        const data = await mockFetchPosts(pageNumber);
        setPosts((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
        setHasMorePosts(data.length === PAGE_SIZE);
        setPage(pageNumber);
      } finally {
        setLoadingPosts(false);
        setIsRefreshing(false);
      }
    },
    [statusFlags.isConnected, accountType, isSelf, loadingPosts]
  );

  useEffect(() => {
    loadPosts(1);
  }, [statusFlags.isConnected, accountType, isSelf]);

  const handleRefresh = () => loadPosts(1, true);

  // -------- Main primary button handler (Connect/Requested/Accept/Unfollow/Edit) --------
  const handlePrimaryAction = async () => {
    if (isSelf) {
      // navigate to edit screen
      navigation.navigate('EditProfile');
      return;
    }

    const { isConnected, isPending, canFollowBack } = statusFlags;

    // Already connected -> unfollow
    if (isConnected) {
      const result = await handleConnectionRequest(accountType === 'public' ? 'Public' : 'Private', friendId, 'Unfollow');
      if (!result.success) return Alert.alert('Error', result.msg);
      await loadProfileStatus();
      return;
    }

    // Can accept incoming request
    if (canFollowBack) {
      const result = await handleConnectionRequest(accountType === 'public' ? 'Public' : 'Private', friendId, 'Accept');
      if (!result.success) return Alert.alert('Error', result.msg);
      await loadProfileStatus();
      if (accountType === 'private') loadPosts(1);
      return;
    }

    // Pending request that I sent -> cancel it
    if (isPending) {
      const result = await handleConnectionRequest(accountType === 'public' ? 'Public' : 'Private', friendId, 'CancelRequest');
      if (!result.success) return Alert.alert('Error', result.msg);
      await loadProfileStatus();
      return;
    }

    // Default -> send follow / follow request
    const result = await handleConnectionRequest(accountType === 'public' ? 'Public' : 'Private', friendId, 'Following');
    if (!result.success) return Alert.alert('Error', result.msg);
    await loadProfileStatus();
    if (accountType === 'public') loadPosts(1);
  };

  const handleMessagePress = () => {
    Alert.alert('Chat', 'Opening chat...');
    // navigation.navigate('ChatScreen', { friendId });
  };

  const showPosts =
    isSelf || accountType === 'public' || statusFlags.isConnected;

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      <ProfileHeader username={user.username} insets={insets} navigation={navigation} />

      <AnimatedScrollView
        ref={scrollRef}
        style={styles.contentScroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <UserDetails
          user={user}
          statusFlags={statusFlags}
          isSelf={isSelf}
          onPrimaryPress={handlePrimaryAction}
          onMessagePress={handleMessagePress}
          onEditProfile={handleEditProfile}
        />

        <View style={styles.divider} />

        {showPosts ? (
          <View style={styles.postGridContainer}>
            <FlatList
              data={posts}
              keyExtractor={(i) => i.key}
              renderItem={({ item }) => <PostGridItem item={item} />}
              numColumns={POST_COLUMNS}
              scrollEnabled={false}
            />

            <PostsFooter isLoadingMore={loadingPosts && page > 1} />

            {hasMorePosts && !loadingPosts && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => loadPosts(page + 1)}
              >
                <Text style={styles.loadMoreText}>Load More Posts</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <PrivateViewPlaceholder user={user} />
        )}
      </AnimatedScrollView>
    </View>
  );
}

// ----------------- STYLES -----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentScroll: { flex: 1, paddingTop: 100 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 15,
  },
  backButton: { paddingRight: 15 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#333' },
  detailsContainer: { paddingHorizontal: 15, paddingVertical: 10 },
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#eee',
    marginRight: 20,
  },
  statsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#333' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 2 },
  nameBioContainer: { marginBottom: 15 },
  fullnameText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  bioText: { fontSize: 14, color: '#555', marginBottom: 5 },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  connectButton: { backgroundColor: '#007AFF', flex: 1 },
  connectButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  connectedButton: { backgroundColor: '#eee', flex: 1 },
  connectedButtonText: { color: '#333', fontWeight: '600', fontSize: 15 },
  messageButton: { backgroundColor: '#333', flex: 0.5 },
  messageButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  postItem: { width: POST_SIZE, height: POST_SIZE, borderWidth: 1, borderColor: '#fff' },
  postImage: { width: '100%', height: '100%' },
  postFooterLoader: { paddingVertical: 20, alignItems: 'center' },
  loadMoreButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  loadMoreText: { color: '#007AFF', fontWeight: '600' },
  privateViewContainer: { alignItems: 'center', paddingVertical: 50 },
  privateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
    textAlign: 'center',
  },
  privateSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  postGridContainer: { flex: 1 },
});
