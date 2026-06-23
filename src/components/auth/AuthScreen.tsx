import colors from '@/constants/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { ComponentProps, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScreenProps = {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
  scrollable?: boolean;
};

export function AuthScreen({
  title,
  children,
  showBackButton = false,
  scrollable = false,
}: AuthScreenProps) {
  const content = (
    <View style={styles.container}>
      <View style={styles.header}>
        {showBackButton && (
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
        )}
        <Image source={require("@/assets/images/logo.png")} style={styles.logoImage} />
        <Text style={styles.logoText}>
          Stage<Text style={styles.logoHighlight}>Book</Text>
        </Text>
        <Text style={styles.slogan}>{title}</Text>
      </View>

      <View style={styles.form}>{children}</View>
    </View>
  );

  if (!scrollable) {
    return content;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior="height"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthInputProps = TextInputProps & {
  label: string;
};

export function AuthInput({ label, style, ...props }: AuthInputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} {...props} />
    </View>
  );
}

type AuthButtonProps = {
  title: string;
  loadingTitle?: string;
  loading?: boolean;
  onPress: () => void;
};

export function AuthButton({
  title,
  loadingTitle = 'Carregando...',
  loading = false,
  onPress,
}: AuthButtonProps) {
  return (
    <Pressable
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.buttonText}>{loading ? loadingTitle : title}</Text>
    </Pressable>
  );
}

type AuthLinkProps = {
  href: ComponentProps<typeof Link>['href'];
  children: string;
};

export function AuthLink({ href, children }: AuthLinkProps) {
  return (
    <Link href={href}>
      <Text style={styles.link}>{children}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lilac,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
    backgroundColor: colors.lilac,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    paddingTop: 34,
    backgroundColor: colors.lilac,
  },

  header: {
    padding: 20,
    paddingVertical: 70
  },

  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },

  logoImage: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignSelf: "center"
  },

  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center'
  },

  logoHighlight: {
    color: colors.purple,
  },

  slogan: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 34,
    textAlign: "center",
    fontStyle: "italic"
  },

  form: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    paddingHorizontal: 32,
    paddingVertical: 44,
    paddingBottom: 80,
  },

  label: {
    color: colors.purple,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 14,
  },

  button: {
    backgroundColor: colors.lilac,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  link: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.purple
  },
});
