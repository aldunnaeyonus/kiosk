Build Web 
    npx expo export:web
    export NODE_OPTIONS=--openssl-legacy-provider  
    expo start --web   
     
Build RUn iOS
    npx expo run:ios
    react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
    node node_modules/react-native/local-cli/cli.js bundle --entry-file='index.js' --bundle-output='./ios/EventKiosk/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'
    react-native run-ios --configuration Release
    
PODs
    pod deintegrate  
    pod install

Start expo 
    npx expo start --clear  

NPM Installs
    expo doctor --fix-dependencies
    npx npm-check-updates -u 
    npm install -g npm-check-updates
    npm install