import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import hotUpdate from 'react-native-ota-hot-update';

const UPDATE_JSON_URL = "https://websute.com/kiosk/update.json";

const startUpdate = async (url: string, version: number) => {
  try {
    await hotUpdate.downloadBundleUri(ReactNativeBlobUtil, url, version, {
      updateSuccess: () => console.log("Update successful!"),
      updateFail: (error: Error) => console.error("Update failed:", error),
      restartAfterInstall: true,
    });
  } catch (error) {
    console.error("Error starting update:", error);
  }
};

const checkVersion = async () => {
  if (!hotUpdate) {
    console.warn("hotUpdate native module is not available. OTA updates will not work.");
    return;
  }
  try {
    const response = await fetch(UPDATE_JSON_URL, {
      headers: { "Cache-Control": "no-cache" },
    });
    const result = await response.json();
    const currentVersion = await hotUpdate.getCurrentVersion();

    if (parseInt(result?.version, 10) > currentVersion) {
      const downloadUrl = Platform.OS === "ios" ? result?.downloadIosUrl : result?.downloadAndroidUrl;
      if (downloadUrl) {
        await startUpdate(downloadUrl, result.version);
      }
    }
  } catch (error) {
    console.error("Failed to check for updates:", error);
  }
};

export const otaUpdateService = {
  checkVersion,
};
