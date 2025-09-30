export interface PlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface PlaceResult {
  name: string;
  id: string;
  types: any[];
  formattedAddress: string;
  addressComponents: [
    {
      longText: string;
      shortText: string;
      types: string[];
      languageCode: 'en';
    },
    {
      longText: 'Ho Chi Minh City';
      shortText: 'Ho Chi Minh City';
      types: ['administrative_area_level_1', 'political'];
      languageCode: 'en';
    },
    {
      longText: 'Vietnam';
      shortText: 'VN';
      types: ['country', 'political'];
      languageCode: 'en';
    },
  ];
  location: {
    latitude: number;
    longitude: number;
  };
  viewport: any;
  googleMapsUri: string;
  utcOffsetMinutes: number;
  adrFormatAddress: string;
  iconMaskBaseUri: string;
  iconBackgroundColor: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  shortFormattedAddress: string;
  photos: PlacePhoto[];
  pureServiceAreaBusiness: false;
  googleMapsLinks: {
    directionsUri: string;
    placeUri: string;
    photosUri: string;
  };
  timeZone: {
    id: string;
  };
}

export interface PlacePhoto {
  flagContentUri: string;
  googleMapsUri: string;
  heightPx: number;
  name: string;
  widthPx: number;
}

export interface SuggestionItem {
  placePrediction: {
    place: string;
    placeId: string;
    text: {
      text: string;
    };
    structuredFormat: {
      mainText: {
        text: string;
        matches: [
          {
            endOffset: number;
          },
        ];
      };
      secondaryText: {
        text: string;
      };
    };
  };
}

export interface SearchPlacesParams {
  input: string;
}

export interface GetPlaceDetailParams {
  placeId: string;
}

export interface GoogleState{
  history: PlaceResult[];
}