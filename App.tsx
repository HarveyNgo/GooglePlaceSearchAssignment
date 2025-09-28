import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigation } from './src/navigations/app.navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store/store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <GestureHandlerRootView>
            <AppNavigation />
          </GestureHandlerRootView>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
