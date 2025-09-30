import axiosInstance from '../../services/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GetPlaceDetailParams,
  PlaceResult,
  SearchPlacesParams,
  SuggestionItem,
} from '../../types/google';
import {
  GET_GOOGLE_PLACE_DETAIL,
  GET_GOOGLE_PLACES,
} from '../../services/endpoint';

export const getGooglePlaces = createAsyncThunk<
  SuggestionItem[],
  SearchPlacesParams
>('google/getGooglePlaces', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(GET_GOOGLE_PLACES, {
      input: params.input,
    });
    return response.data.suggestions;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? error);
  }
});

export const getGooglePlaceDetail = createAsyncThunk<
  PlaceResult,
  GetPlaceDetailParams
>('google/getGooglePlaceDetail', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      GET_GOOGLE_PLACE_DETAIL.replace('{place_id}', params.placeId),
      {
        headers: {
          'X-Goog-FieldMask': '*',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? error);
  }
});
