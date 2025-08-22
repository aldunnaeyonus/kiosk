import { NavigatorScreenParams } from '@react-navigation/native';

// Define the parameters for each screen in the authentication flow
export type AuthStackParamList = {
  SignIn: undefined;
  Register: undefined;
};

// Define the parameters for each screen in the main application flow
export type AppStackParamList = {
  EventList: undefined;
  AddEvent: undefined;
  Checkins: { kiosk_event: string, kiosk_id: string, event_logo: string, prints: number, owner_id: string };
  KioskSettings: undefined;
  AddAttendee: { searchText: string, kiosk_id: string, pin: string, prints: number, logo: string };
  WebView: { url: string, name: string };
  ChangePassword: undefined;
  ChangeData: undefined;
  ViewEventList: { kiosk_id: string, kiosk_event: string, event_logo: string };
  EditEvent: { kiosk_id: string };
  SelectPrinter: undefined;
  ViewAttendees: { kiosk_id: string, kiosk_event: string };
};

// Define the root navigator's parameters, nesting the other navigators
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
