import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const CUSTOM_IMAGE_KEY = 'siyul-block-image-uri';

export async function loadCustomImageUri(): Promise<string | null> {
  const uri = await AsyncStorage.getItem(CUSTOM_IMAGE_KEY);
  if (!uri) return null;

  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    await AsyncStorage.removeItem(CUSTOM_IMAGE_KEY);
    return null;
  }

  return uri;
}

export async function saveCustomImage(sourceUri: string): Promise<string> {
  const directory = `${FileSystem.documentDirectory}block-images/`;
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

  const extension = sourceUri.toLowerCase().includes('.png') ? 'png' : 'jpg';
  const destination = `${directory}block-${Date.now()}.${extension}`;

  await FileSystem.copyAsync({ from: sourceUri, to: destination });
  await AsyncStorage.setItem(CUSTOM_IMAGE_KEY, destination);
  return destination;
}

export async function removeCustomImage(): Promise<void> {
  const uri = await AsyncStorage.getItem(CUSTOM_IMAGE_KEY);
  if (uri) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
  await AsyncStorage.removeItem(CUSTOM_IMAGE_KEY);
}