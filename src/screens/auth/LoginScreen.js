import React, { useEffect } from 'react';
import { View, Button, Linking } from 'react-native';
import LanguageUtil from '../../utils/LanguageUtil';

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
        title={LanguageUtil.getName('login_text')}
        onPress={() => login()}
      />
    </View>
  );
}