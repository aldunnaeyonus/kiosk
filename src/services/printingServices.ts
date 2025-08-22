import { RefObject } from 'react';
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import BRPtouchPrinter, { Printer } from 'react-native-brother-printers';
import ViewShot, { captureRef, releaseCapture } from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';

interface NameTagData {
  fname: string;
  lname: string;
  logo: string;
}

/**
 * Captures a React component as an image and prints it multiple times.
 * This function determines whether to use AirPrint or a Brother printer based on user settings.
 * @param viewRef - The ref of the ViewShot component to capture.
 * @param nameTagData - The data to render inside the name tag component.
 * @param printCount - The number of copies to print.
 */
export const printWithNameTag = async (
  viewRef: RefObject<ViewShot>,
  nameTagData: NameTagData,
  printCount: number
): Promise<void> => {
  if (Platform.OS === 'web') {
    Toast.show({ type: ALERT_TYPE.WARNING, title: 'Unsupported', textBody: 'Printing is not available on the web.' });
    return;
  }

  let uri: string | undefined;
  try {
    // The component to be printed is rendered off-screen by the calling component.
    // Here we just capture it.
    uri = await captureRef(viewRef);
    
    const useAirPrint = JSON.parse(await AsyncStorage.getItem("useAirPrint") || 'false');

    for (let i = 0; i < printCount; i++) {
      if (useAirPrint) {
        await printWithAirPrint(uri);
      } else {
        await printWithBrother(uri);
      }
    }

    Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Printing', textBody: 'Name tag sent to printer.' });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown printing error occurred.";
    console.error("Printing failed:", error);
    throw new Error(message);
  } finally {
    if (uri) {
      releaseCapture(uri);
    }
  }
};

const printWithAirPrint = async (uri: string) => {
  const printerUrl = await AsyncStorage.getItem("AirprintURL");
  await Print.printAsync({
    uri,
    orientation: Print.Orientation.landscape,
    printerUrl: printerUrl || undefined,
  });
};

const printWithBrother = async (uri: string) => {
  const printerJSON = await AsyncStorage.getItem("BrotherPrinter");
  const useBT = await AsyncStorage.getItem("useBT");
  const labelSize = await AsyncStorage.getItem("BrotherPrinterLabel");

  if (!printerJSON) {
    throw new Error("No Brother printer has been selected in settings.");
  }

  const printer: Printer = JSON.parse(printerJSON);

  await BRPtouchPrinter.printImage(printer, useBT === '1' ? "1" : "0", uri, {
    autoCut: true,
    labelSize: parseInt(labelSize || '10', 10),
  });
};
