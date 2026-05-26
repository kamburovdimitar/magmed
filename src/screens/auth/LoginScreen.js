import React, { useEffect } from 'react';
import { View, Button, Linking } from 'react-native';

export default function LoginScreen({ goTo }) {

  useEffect(() => {
    const sub = Linking.addEventListener("url", (event) => {
      
      console.log("CALLBACK URL:", event.url);
    });

    return () => sub.remove();
  }, []);

  async function login() {
    //Linking.openURL('http://localhost:49477/caats-login');
    goTo("home")
  }

  return (
    <View>
      <Button
        title="Login"
        onPress={() => login()}
      />
    </View>
  );
}