import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView,
    ActivityIndicator,
    Image,
    Keyboard,
    Platform
} from 'react-native';
import { Search, ChevronRight } from 'lucide-react-native';
import userStore from '../../../store/MyStore';
import { useNavigation } from '@react-navigation/native';

// --- Configuration ---
const SUGGESTION_LIMIT = 5;
const DEBOUNCE_DELAY_MS = 300; // Time to wait after typing stops before searching




// --- 1. Debounce Hook ---
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes (typing continues)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}


// --- 2. Main Search Screen Component ---

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const {SearchUser} = userStore()
    const navigation = useNavigation()
    // Apply debouncing to the search text
    const debouncedSearchText = useDebounce(searchText, DEBOUNCE_DELAY_MS);

    // --- Side Effect for Suggestions ---
    useEffect(() => {
        // Only run if the debounced text is valid
        if (debouncedSearchText.length >= 2) {
            setLoading(true);

            
            
            SearchUser(debouncedSearchText,5,1)
                .then(data => {
                    setSuggestions(data);
                })
                .catch(error => {
                    console.error("Search suggestion failed:", error);
                    setSuggestions([]);
                })
                .finally(() => {
                    setLoading(false);
                });



        }else if(debouncedSearchText.length === 0){
            setSuggestions([])
        }
    }, [debouncedSearchText]); // Triggered ONLY when debouncedSearchText changes

    // --- Navigation Mock (Replace with actual navigation) ---
   const navigateToUserList = useCallback((query) => {
    // 1. Dismiss the keyboard
    Keyboard.dismiss();

    // 2. Navigate to the nested screen 'Users' inside the top-level 'Screens'
    navigation.navigate('Screens', {
        screen: 'Users',
        params: {
            query: query.trim(), 
        }
    });

    // 3. Clear suggestions
    setSuggestions([]);
}, [navigation]);



    // --- Handlers ---
    const handleSearch = () => {
        if (searchText.trim().length > 0) {
            navigateToUserList(searchText.trim());
        }
    };

    const handleSuggestionPress = (user) => {
        // Navigate directly to the user's profile or run a search for their exact username
        navigateToUserList(user.username);
    };

    // --- Render Functions ---
    const renderSuggestionItem = ({ item }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item)}>
            <Image source={item.profile ? { uri: item.profile } : require("../../../asset/UserLogo.png" )}  style={styles.profilePic} />
            <View style={styles.textContainer}>
                <Text style={styles.usernameText} numberOfLines={1}>{item.username}</Text>
                <Text style={styles.fullnameText} numberOfLines={1}>{item.fullname}</Text>
            </View>
            <ChevronRight size={18} color="#aaa" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBarContainer}>
                <Search size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={`Search users (limit: ${SUGGESTION_LIMIT})`}
                    value={searchText}
                    onChangeText={setSearchText}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                />
                {loading && (
                    <ActivityIndicator size="small" color="#007AFF" style={styles.activityIndicator} />
                )}
            </View>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.username}
                        renderItem={renderSuggestionItem}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            )}

            {/* No Results Message */}
            {/* {debouncedSearchText.length >= 2 && !loading && suggestions.length === 0 && (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No users found for "{debouncedSearchText}".</Text>
                    <TouchableOpacity onPress={handleSearch}>
                         <Text style={styles.searchButtonText}>Tap here to search the entire database</Text>
                    </TouchableOpacity>
                </View>
            )} */}

        </SafeAreaView>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 10,
        marginTop : 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    activityIndicator: {
        marginLeft: 10,
    },
    // Suggestions
    suggestionsContainer: {
        marginHorizontal: 10,
        backgroundColor: '#ffffffff',
        borderRadius: 10,
        borderTopWidth: 1,
        
        borderTopColor: '#eee',
        // Max height to prevent it from taking the whole screen
        maxHeight: 500, 
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 10,
    },
    usernameText: {
        fontWeight: '600',
        fontSize: 15,
        color: '#333',
    },
    fullnameText: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    // No Results
    noResultsContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 8,
    },
    searchButtonText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    }
});