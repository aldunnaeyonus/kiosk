import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { AppStackParamList } from '../../types/navigation';

type WebViewerNavigationProp = StackNavigationProp<AppStackParamList, 'WebView'>;
type WebViewerRouteProp = RouteProp<AppStackParamList, 'WebView'>;

const WebViewer: React.FC = () => {
  const navigation = useNavigation<WebViewerNavigationProp>();
  const route = useRoute<WebViewerRouteProp>();

  const { name, url } = route.params;

  useEffect(() => {
    if (name) {
      navigation.setOptions({
        headerTitle: name,
      });
    }
  }, [name, navigation]);

  return (
    <SafeAreaProvider>
      <WebView
        source={{ uri: url }}
        automaticallyAdjustContentInsets={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </SafeAreaProvider>
  );
};

export default WebViewer;
