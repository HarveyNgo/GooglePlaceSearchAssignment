import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { PlaceResult, SuggestionItem } from '../../types/google';
import { useAppDispatch } from '../../redux/hook/useAppDispatch';
import {
  getGooglePlaceDetail,
  getGooglePlaces,
} from '../../redux/actions/googleActions';
import { Colors } from '../../constants/colors';

interface Props {
  onPlaceSelected: (place: PlaceResult) => void;
}

const PlaceSearch: React.FC<Props> = ({ onPlaceSelected }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useAppDispatch();

  const fetchPlaceDetails = async (place_id: string) => {
    dispatch(
      getGooglePlaceDetail({
        placeId: place_id,
      }),
    )
      .unwrap()
      .then(data => {
        console.log('hung getGooglePlaceDetail data:', data);
        onPlaceSelected(data);
        setShowSuggestions(false);
      })
      .catch(() => {});
  };

  const fetchPlaces = useCallback(
    async (text: string) => {
      dispatch(
        getGooglePlaces({
          input: text,
        }),
      )
        .unwrap()
        .then(data => {
          console.log('hung data:', data);
          setSuggestions(data || []);
        })
        .catch(() => {});
    },
    [dispatch],
  );

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchPlaces(query);
    }, 400);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query, fetchPlaces]);

  const renderItem = ({ item }: { item: SuggestionItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        fetchPlaceDetails(item.placePrediction.placeId);
      }}
    >
      <Text style={styles.itemMain}>
        {item.placePrediction.structuredFormat.mainText.text}
      </Text>
      <Text style={styles.itemSecondary}>
        {item.placePrediction.structuredFormat?.secondaryText?.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search places"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        returnKeyType="search"
        onFocus={() => setShowSuggestions(true)} // show when focus
      />

      {showSuggestions && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={item => item.placePrediction.placeId}
          renderItem={renderItem}
          style={styles.suggestions}
        />
      )}
    </View>
  );
};

export { PlaceSearch };

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  suggestions: {
    maxHeight: 240,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  item: { padding: 12, borderBottomWidth: 1, borderColor: Colors.border },
  itemMain: { fontWeight: '600' },
  itemSecondary: { fontSize: 12, color: Colors.grayStrong },
});
