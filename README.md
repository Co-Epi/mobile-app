# CoEpiMobile

This repo contains both the iOS and Android Co-Epi mobile apps. The apps share common interface elements built with react native.

## iOS

Run the following commands to bootstrap the react native environment, and launch the react native server.


```bash
$ sudo gem install cocoapods
$ npm install
$ cd ios; pod install
$ npm run ios
```

## Android

Run the following commands to bootstrap the react native environment, and launch the react native server.

```bash
$ npm install
$ npm run android
```

Once the react native server is running, open the android project in Android Studio. You should be able to launch the app with Run -> Debug. You'll have to configure a virtual device for the emulator if you do not have one already.
