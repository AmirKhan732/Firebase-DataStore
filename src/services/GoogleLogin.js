// GoogleLogin.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { onAuthStateChanged, GoogleAuthProvider, signInWithCredential, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// ⚠️ Replace these with your real IDs from Google Cloud Console
const EXPO_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
const IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';

export default function GoogleLogin() {
  const [user, setUser] = useState(null);

  // Good redirect for both dev (Expo Go) and prod (standalone)
  const redirectUri = makeRedirectUri({
    scheme: 'yourapp', // must match app.json "scheme"
    // Use Expo proxy in development (Expo Go), native in standalone
    useProxy: Platform.select({ web: false, default: true }),
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,     // works with Expo proxy
    iosClientId: IOS_CLIENT_ID,       // for standalone iOS
    androidClientId: ANDROID_CLIENT_ID, // for standalone Android
    responseType: 'id_token',
    scopes: ['profile', 'email'],
    redirectUri,
  });

  // Handle Google ➜ Firebase
  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const { user } = await signInWithCredential(auth, credential);

        // Create/Update user doc in Firestore
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            email: user.email ?? '',
            displayName: user.displayName ?? '',
            photoURL: user.photoURL ?? '',
            provider: 'google',
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      }
    };
    signInWithGoogle();
  }, [response]);

  // Track auth state for UI
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    await promptAsync({ useProxy: Platform.select({ web: false, default: true }) });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <View style={{ padding: 20, gap: 16, alignItems: 'center' }}>
      {user ? (
        <>
          <Image
            source={{ uri: user.photoURL }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <Text>Welcome, {user.displayName}</Text>
          <Text>{user.email}</Text>
          <Button title="Sign Out" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text>Sign in to continue</Text>
          <Button
            title="Sign in with Google"
            onPress={handleGoogleLogin}
            disabled={!request}
          />
        </>
      )}
    </View>
  );
}
