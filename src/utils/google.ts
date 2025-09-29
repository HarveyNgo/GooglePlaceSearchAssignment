import { GOOGLE_MAPS_API_KEY } from '../config/google';

export const buildPhotoUrl = (photoName: string, maxWidth = 400) => {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${GOOGLE_MAPS_API_KEY}`;
};
