import React from 'react';
import {MainNavigation} from './main.navigation';

export enum SCREEN_NAME {
  HomeScreen = 'HomeScreen',
}

export const AppNavigation = () => {
  return  <MainNavigation />;
};
