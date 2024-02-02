import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { SafeAreaProvider } from "react-native-safe-area-context";

function WebViewer({ route, navigation }) {
  useEffect(() => {
    if (route.params.name) {
      navigation.setOptions({
        headerTitle: route.params.name,
      });
    }
  });

  return (
    <SafeAreaProvider>
      <WebView
        enableApplePay={true}
        source={{ uri: route.params.url }}
        automaticallyAdjustContentInsets={false}
      />
    </SafeAreaProvider>
  );
}

export default WebViewer;
