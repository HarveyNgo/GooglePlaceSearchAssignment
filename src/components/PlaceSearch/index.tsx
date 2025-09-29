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

interface Props {
  onPlaceSelected: (place: PlaceResult) => void;
}

const PlaceSearch: React.FC<Props> = ({ onPlaceSelected }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useAppDispatch();

  //   const fetchSuggestions = async (input: string) => {
  //     if (!input) {
  //       setSuggestions([]);
  //       return;
  //     }

  //     try {
  //       const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
  //         input,
  //       )}&key=${GOOGLE_MAPS_API_KEY}&language=en&components=country:vn`;
  //       const res = await fetch(url);
  //       console.log('hung res:', res);
  //       const json = await res.json();
  //       console.log('hung jso:', json);
  //       if (json.status === 'OK') {
  //         setSuggestions(json.predictions || []);
  //       } else {
  //         setSuggestions([]);
  //       }
  //     } catch (e) {
  //       console.warn('Autocomplete fetch error', e);
  //       setSuggestions([]);
  //     }
  //   };

  //   const debouncedFetch = debounce(
  //     (input: string) => fetchSuggestions(input),
  //     300,
  //   );

  //   const onChangeText = (text: string) => {
  //     setQuery(text);
  //     debouncedFetch(text);
  //   };

  const fetchPlaceDetails = async (place_id: string) => {
    // try {
    //   const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAPS_API_KEY}&fields=name,formatted_address,geometry,place_id`;
    //   const res = await fetch(url);
    //   const json = await res.json();
    //   if (json.status === 'OK') {
    //     const place: PlaceResult = json.result;
    //     onPlaceSelected(place);
    //     setQuery('');
    //     setSuggestions([]);
    //   } else {
    //     console.warn('Place details error', json);
    //   }
    // } catch (e) {
    //   console.warn('Place details fetch error', e);
    // }

    dispatch(
      getGooglePlaceDetail({
        placeId: place_id,
      }),
    )
      .unwrap()
      .then(data => {
        console.log('hung getGooglePlaceDetail data:', data);
        onPlaceSelected(data);
      })
      .catch(() => {});
  };

  const fetchPlaces = useCallback(
    async (text: string) => {
      // if (cancelToken.current) cancelToken.current.cancel('New request started');
      // cancelToken.current = axios.CancelToken.source();
      // console.log('hung suggestions:', suggestions);
      // try {
      //   const response = await axios.post(
      //     'https://places.googleapis.com/v1/places:autocomplete',
      //     {
      //       input: text,
      //       // cancelToken: cancelToken.current.token,
      //       includedPrimaryTypes: ['locality'], // optional
      //       languageCode: 'en',
      //     },
      //     {
      //       headers: {
      //         'Content-Type': 'application/json',
      //         'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      //       },
      //     },
      //   );
      //   console.log('hung res:', response);
      //   setSuggestions(response.data.suggestions || []);
      // } catch (error) {
      //   console.log('hung error:', error);
      //   if (!axios.isCancel(error)) console.error(error);
      // }

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
        {item.placePrediction.structuredFormat.secondaryText.text}
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
      />

      {suggestions.length > 0 && (
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
  container: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
  input: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#eee',
    borderWidth: 1,
  },
  suggestions: { maxHeight: 240, borderTopWidth: 1, borderColor: '#eee' },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#f4f4f4' },
  itemMain: { fontWeight: '600' },
  itemSecondary: { fontSize: 12, color: '#666' },
});
