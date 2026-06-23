import colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ReactNode, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

type PanelScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showBackButton?: boolean;
};

export function PanelScreen({
  title,
  subtitle,
  children,
  showBackButton = false,
}: PanelScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {showBackButton && (
            <Pressable style={styles.backButton} onPress={() => router.replace('/(panel)/home/page')}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </Pressable>
          )}

          <Text style={styles.logoText}>
            Stage<Text style={styles.logoHighlight}>Book</Text>
          </Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.form}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

type FormInputProps = TextInputProps & {
  label: string;
};

export function FormInput({ label, style, ...props }: FormInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, props.multiline && styles.textArea, style]}
        placeholderTextColor="#8f8f8f"
        {...props}
      />
    </View>
  );
}

type CoverPickerFieldProps = {
  label: string;
  value: string | null;
  onChange: (imageUri: string | null) => void;
};

export function CoverPickerField({ label, value, onChange }: CoverPickerFieldProps) {
  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso às fotos para escolher uma capa do show.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    onChange(result.assets[0].uri);
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.coverPicker} onPress={handlePickImage}>
        {value ? (
          <Image source={{ uri: value }} style={styles.coverImage} contentFit="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="image-outline" size={30} color={colors.purple} />
            <Text style={styles.coverTitle}>Selecionar foto</Text>
            <Text style={styles.coverHint}>Essa imagem será a capa do show</Text>
          </View>
        )}
      </Pressable>

      {value ? (
        <View style={styles.coverActions}>
          <Pressable style={styles.secondaryButton} onPress={handlePickImage}>
            <Ionicons name="swap-horizontal" size={18} color={colors.purple} />
            <Text style={styles.secondaryButtonText}>Trocar foto</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => onChange(null)}>
            <Ionicons name="trash-outline" size={18} color={colors.purple} />
            <Text style={styles.secondaryButtonText}>Remover</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

type DatePickerFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
};

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Selecione a data',
}: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ?? new Date());

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

  function handleSelect(day: number) {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    onChange(selectedDate);
    setVisible(false);
  }

  function changeMonth(amount: number) {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + amount, 1),
    );
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.dateInput} onPress={() => setVisible(true)}>
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.purple} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendar}>
            <View style={styles.calendarHeader}>
              <Pressable style={styles.iconButton} onPress={() => changeMonth(-1)}>
                <Ionicons name="chevron-back" size={22} color={colors.purple} />
              </Pressable>

              <Text style={styles.calendarTitle}>{formatMonth(currentMonth)}</Text>

              <Pressable style={styles.iconButton} onPress={() => changeMonth(1)}>
                <Ionicons name="chevron-forward" size={22} color={colors.purple} />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {weekDays.map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {days.map((day, index) => {
                const selected = Boolean(
                  value &&
                    day &&
                    value.getDate() === day &&
                    value.getMonth() === currentMonth.getMonth() &&
                    value.getFullYear() === currentMonth.getFullYear(),
                );

                if (!day) {
                  return <View key={`empty-${index}`} style={styles.dayCell} />;
                }

                return (
                  <Pressable
                    key={day}
                    style={[styles.dayCell, selected && styles.daySelected]}
                    onPress={() => handleSelect(day)}
                  >
                    <Text style={[styles.dayText, selected && styles.daySelectedText]}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.cancelButton} onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type PrimaryButtonProps = {
  title: string;
  loadingTitle?: string;
  loading?: boolean;
  onPress: () => void;
};

export function PrimaryButton({
  title,
  loadingTitle = 'Salvando...',
  loading = false,
  onPress,
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={[styles.primaryButton, loading && styles.disabledButton]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.primaryButtonText}>{loading ? loadingTitle : title}</Text>
    </Pressable>
  );
}

function getCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstWeekDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const emptyDays = Array.from({ length: firstWeekDay }, () => null);
  const monthDays = Array.from({ length: totalDays }, (_, index) => index + 1);

  return [...emptyDays, ...monthDays];
}

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR');
}

function formatMonth(date: Date) {
  const month = date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return month.charAt(0).toUpperCase() + month.slice(1);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scrollView: {
    flex: 1,
    backgroundColor: colors.lilac,
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    backgroundColor: colors.lilac,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 56,
  },

  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },

  logoText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 22,
  },

  logoHighlight: {
    color: colors.purple,
  },

  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
  },

  form: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    paddingHorizontal: 32,
    paddingTop: 36,
    paddingBottom: 32,
    marginTop: -24,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    color: colors.purple,
    fontWeight: '600',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    color: colors.black,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },

  coverPicker: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 14,
    minHeight: 170,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },

  coverImage: {
    width: '100%',
    height: 190,
  },

  coverPlaceholder: {
    minHeight: 170,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: colors.lightLilac,
  },

  coverTitle: {
    color: colors.purple,
    fontWeight: 'bold',
    marginTop: 10,
  },

  coverHint: {
    color: colors.black,
    marginTop: 4,
    textAlign: 'center',
  },

  coverActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  secondaryButtonText: {
    color: colors.purple,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateText: {
    color: colors.black,
    fontSize: 14,
  },

  placeholder: {
    color: '#8f8f8f',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  calendar: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightLilac,
  },

  calendarTitle: {
    color: colors.purple,
    fontSize: 16,
    fontWeight: 'bold',
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  weekDay: {
    width: `${100 / 7}%`,
    color: colors.purple,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  daySelected: {
    backgroundColor: colors.pink,
  },

  dayText: {
    color: colors.black,
    fontWeight: '500',
  },

  daySelectedText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  cancelButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },

  cancelText: {
    color: colors.purple,
    fontWeight: 'bold',
  },

  primaryButton: {
    backgroundColor: colors.lilac,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
