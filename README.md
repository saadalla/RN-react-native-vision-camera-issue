This is [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

This project is used to demonstrate an issue with react-native-camera
The issue is related to building a bundle for android (.aab)
Other than that the app is working fine.


## Step 1: Start Metro

```sh
# Using npm
npm start

# using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Reproducing the problem

1. from your project folder change to android folder
cd andoid

2. Attempt bundle generation (.aab)
./gradlew bundleRelease

3. You get the build failure message below:

Task :react-native-vision-camera:externalNativeBuildRelease FAILED

...

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':react-native-vision-camera:externalNativeBuildRelease'.
> java.io.FileNotFoundException: /Users/development/rntest/node_modules/react-native-vision-camera/android/build/intermediates/cxx/RelWithDebInfo/5s2a6h5u/obj/armeabi-v7a/libVisionCamera.so (No such file or directory)

