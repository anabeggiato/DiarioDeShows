import { AuthButton, AuthInput, AuthLink, AuthScreen } from '@/components/auth/AuthScreen';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/(panel)/profile/page');
  }

  return (
    <AuthScreen title="Suas memórias reunidas em um só lugar">
      <AuthInput
        label="Email"
        placeholder="Digite seu email..."
        value={email}
        onChangeText={setEmail}
      />

      <AuthInput
        label="Senha"
        placeholder="Digite sua senha..."
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <AuthButton title="Acessar" loading={loading} onPress={handleSignIn} />

      <AuthLink href="/(auth)/signup/page">
        Ainda não possui uma conta? cadastre-se
      </AuthLink>
    </AuthScreen>
  );
}
