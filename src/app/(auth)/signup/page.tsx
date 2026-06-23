import { AuthButton, AuthInput, AuthScreen } from '@/components/auth/AuthScreen';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/(auth)/signin/page');
  }

  return (
    <AuthScreen title="Criar uma conta" showBackButton scrollable>
      <AuthInput
        label="Nome completo"
        placeholder="Digite seu nome completo..."
        value={name}
        onChangeText={setName}
      />

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

      <AuthButton title="Cadastrar" loading={loading} onPress={handleSignUp} />
    </AuthScreen>
  );
}
