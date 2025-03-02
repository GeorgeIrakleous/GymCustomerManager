# GymCustomerManager

GymCustomerManager is a full-stack mobile application designed for gym administrators to manage customer subscriptions and related data. It consists of two main parts:

- **gymapp**: The React Native/Expo mobile app.
- **functions**: Firebase Cloud Functions that handle backend operations (e.g., automated SMS notifications via Firebase Cloud Scheduler and Twilio).

> **Note:**  
> This app is designed for a single user—the gym manager responsible for customer management.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Firebase Client Setup (gymapp)](#firebase-client-setup-gymapp)
  - [Cloud Functions & Twilio Setup (functions)](#cloud-functions--twilio-setup-functions)
- [Running the Project](#running-the-project)
- [Building Standalone Apps](#building-standalone-apps)
- [Project Structure](#project-structure)
- [Important Notes](#important-notes)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Customer Management:**  
  Add, edit, and view customer details with real-time subscription status.
- **Real-Time Search:**  
  Quickly filter customer records using a flexible matching algorithm.
- **Automated Notifications:**  
  Firebase Cloud Scheduler and Cloud Functions check subscription expiry and send SMS alerts via Twilio.
- **Payment Update Flow:**  
  Easily mark payments as complete, updating payment and subscription dates automatically.
- **Custom UI Components:**  
  A polished interface with smooth animations (including a bouncy green check mark for success).

## Prerequisites

- **Node.js & npm/yarn:** A recent version of [Node.js](https://nodejs.org/) is required.
- **Expo CLI:** Install globally or use `npx expo` commands.
- **Firebase Project:** Create a Firebase project for Firestore and Cloud Functions.
- **Twilio Account:** Create a Twilio account (free trial available) for SMS notifications.
- **Git:** To clone and manage the repository.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/YourUsername/GymCustomerManager.git
   cd GymCustomerManager
Project Structure Overview:

This repository contains two main directories:

gymapp: The mobile app (React Native/Expo).
functions: Firebase Cloud Functions.
To work on the mobile app, navigate into the gymapp folder:

bash
Copy
cd gymapp
Install Dependencies for the Mobile App:

bash
Copy
npm install
# or, if you prefer yarn:
yarn install
(Optional) Install Dependencies for Cloud Functions:

In a separate terminal, navigate to the functions directory:

bash
Copy
cd ../functions
npm install
# or
yarn install
Configuration
Firebase Client Setup (gymapp)
Open gymapp/firebaseConfig.js and replace the placeholder values with your actual Firebase configuration:

js
Copy
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",               // Replace with your Firebase API key
  authDomain: "YOUR_AUTH_DOMAIN_HERE",       // Replace with your Firebase Auth Domain
  projectId: "YOUR_PROJECT_ID_HERE",         // Replace with your Firebase Project ID
  storageBucket: "YOUR_STORAGE_BUCKET_HERE", // Replace with your Firebase Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE", // Replace with your Messaging Sender ID
  appId: "YOUR_APP_ID_HERE",                 // Replace with your Firebase App ID
  measurementId: "YOUR_MEASUREMENT_ID_HERE"  // Optional: For Firebase Analytics
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
Cloud Functions & Twilio Setup (functions)
In the functions folder, you should have an environment file (e.g., .env.default) that looks like this:

bash
Copy
# .env.default
TWILIO_SID=YOUR_TWILIO_SID_HERE
TWILIO_TOKEN=YOUR_TWILIO_TOKEN_HERE
TWILIO_NUMBER=YOUR_TWILIO_NUMBER_HERE
MY_PHONE_NUMBER=YOUR_PHONE_NUMBER_HERE
Important:

Use placeholder values in the public version of this file.
Ensure that any file with your real credentials (e.g., .env) is added to .gitignore to avoid exposing sensitive information.
Running the Project
In Development
Start the Expo Development Server:

From the gymapp folder, run:

bash
Copy
npx expo start
Launch on Your Device or Emulator:

Use the Expo Go app on your mobile device.
On a Mac with Xcode, press i to launch the iOS Simulator, or a for an Android emulator.
Running Cloud Functions Locally (Optional)
If you need to test your cloud functions locally:

Install Firebase CLI:

bash
Copy
npm install -g firebase-tools
Start the Emulators:

From the root of your repository (or the functions folder), run:

bash
Copy
firebase emulators:start --only functions
Building Standalone Apps
You can use Expo's EAS Build to create standalone binaries for Android and iOS:

Android APK:

bash
Copy
npx eas build --platform android
iOS IPA:

bash
Copy
npx eas build --platform ios
Note: Building for iOS requires either access to a Mac with Xcode or using EAS Build with your Apple Developer account.

Important Notes
Single User App:
GymCustomerManager is designed for use by a single user—the gym manager.

Firebase Cloud Functions & Billing:
To use Firebase Cloud Functions in production, you must upgrade to the Blaze Plan (Pay-As-You-Go).

Twilio Trial Limitations:
With a Twilio free trial account, you must use the provided Twilio number and can only send SMS messages to verified numbers.
