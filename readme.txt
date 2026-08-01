Big Dog Tags — Mobile Check-In AppSeamless, high-speed guest check-in for events of any scale. Available on iOS and iPadOS.Check-in is the first physical touchpoint of your event. The Big Dog Tags mobile app removes queues, stress, and friction, delivering a fast entry experience for guests and a real-time dashboard for event teams.Deployment ModesThe Big Dog Tags mobile app operates in two flexible configurations:Integrated Mode: Synchronizes real-time attendance, guest attributes, and engagement data directly with the Big Dog Tags Core Event Marketing Platform.Standalone Mode (DIY): Allows instant CSV/XLSX guest list uploads directly to the app for standalone events without platform integration.Core FeaturesUniversal Device Compatibility: Optimized layout and performance for both iPhone and iPad, allowing mixed-device team deployment on-site.Instant Guest List Search: High-performance, real-time search across thousands of attendees with low latency.Live Analytics Dashboard: Monitor entry velocity, guest arrival percentages, and VIP status in real time.Offline Resilience: Maintains local data persistence to guarantee continuous check-ins during network disruptions.Multi-Device Sync: Automatic cloud sync across all active staff devices at entry points.Compatibility & RequirementsSpecificationDetailsSupported Operating SystemsiOS 15.0+ / iPadOS 15.0+Supported DevicesiPhone, iPad, iPad Air, iPad ProNetwork RequirementsOnline (Cellular/Wi-Fi) for multi-device sync; Offline mode supportedData Formats (DIY Mode)CSV, XLSXGetting Started1. Standalone / DIY Guest List SetupExport your guest list in .csv or .xlsx format.Ensure columns contain at minimum: First Name, Last Name, Email, Ticket Type / Group.Import the file via the app interface or administrative portal.Distribute device setup keys to your check-in team.2. Integrated SetupLink the app to your Big Dog Tags Core Event Marketing Platform account via QR code or OAuth login.Select the active event from your dashboard.Live attendee records will sync automatically across all paired check-in terminals.Summary OverviewFeature / AttributeDetailsBusiness ValuePlatform AvailabilityiPhone & iPadEnables flexible staff deployment using existing hardwareIntegration FlexibilityCore Platform Sync OR Standalone File UploadWorks for both enterprise event suites and one-off DIY eventsSearch PerformanceInstant sub-second searchPrevents long queues and door bottlenecksAnalyticsLive arrival tracking & reportingProvides actionable event management metrics in real timeCore MissionStreamlined relationship buildingConverts guest check-in from an operational burden into a positive brand interaction

Build Web 
    npx expo export:web
    export NODE_OPTIONS=--openssl-legacy-provider  
    expo start --web   
     
Build RUn iOS
    npx expo run:ios
    npx react-native bundle --entry-file='index.js' --bundle-output='./ios/BigDogTags/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'
    node node_modules/react-native/local-cli/cli.js bundle --entry-file='index.js' --bundle-output='./ios/BigDogTags/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'
    react-native run-ios --configuration Release
    
PODs
    pod deintegrate  
    pod install

Start expo 
    npx expo start --clear  v

NPM Installs
    expo doctor --fix-dependencies
    npx npm-check-updates -u 
    npm install -g npm-check-updates
    npm install

Watchman
    watchman watch-del '/Users/andrewdunn/Documents/GitHubDunn/kiosk' ; watchman watch-project '/Users/andrewdunn/Documents/GitHubDunn/kiosk'
