import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export default function Profile() {
  const { setAuth } = useAuth();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    setAuth(null)

    if (error) {
      Alert.alert("error", "erro ao deslogar, tente novamente em alguns segundos")
      return
    }
  }

  return (
    <View style={styles.container}>
      <Text>Página Perfil</Text>

      <Button title="Deslogar" onPress={handleSignOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
  }
})