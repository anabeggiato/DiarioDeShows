import colors from '@/constants/colors';
import {
  searchUpcomingShows,
  TicketmasterEvent,
} from '@/services/ticketmaster.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpcomingShows() {
  const [artist, setArtist] = useState('');
  const [city, setCity] = useState('');
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadEvents(searchArtist = artist, searchCity = city) {
    try {
      setError('');
      setLoading(true);

      const upcomingEvents = await searchUpcomingShows({
        artist: searchArtist,
        city: searchCity,
      });

      setEvents(upcomingEvents);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : 'Não foi possível carregar os próximos shows.';

      setError(message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setArtist('');
    setCity('');
    loadEvents('', '');
  }

  useEffect(() => {
    loadEvents('', '');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace('/(panel)/home/page')}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>

          <Text style={styles.logoText}>
            Stage<Text style={styles.logoHighlight}>Book</Text>
          </Text>
          <Text style={styles.title}>Próximos shows</Text>
          <Text style={styles.subtitle}>
            Encontre eventos musicais futuros usando a Ticketmaster.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.searchBox}>
            <View style={styles.field}>
              <Text style={styles.label}>Artista ou evento</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Coldplay"
                placeholderTextColor="#8f8f8f"
                value={artist}
                onChangeText={setArtist}
                returnKeyType="search"
                onSubmitEditing={() => loadEvents()}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: São Paulo"
                placeholderTextColor="#8f8f8f"
                value={city}
                onChangeText={setCity}
                returnKeyType="search"
                onSubmitEditing={() => loadEvents()}
              />
            </View>

            <View style={styles.searchActions}>
              <Pressable style={styles.primaryButton} onPress={() => loadEvents()}>
                <Ionicons name="search" size={18} color={colors.white} />
                <Text style={styles.primaryButtonText}>Buscar</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleClear}>
                <Ionicons name="close" size={18} color={colors.purple} />
                <Text style={styles.secondaryButtonText}>Limpar</Text>
              </Pressable>
            </View>
          </View>

          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function renderContent() {
    if (loading) {
      return (
        <View style={styles.stateWrapper}>
          <ActivityIndicator size="large" color={colors.pink} />
          <Text style={styles.stateText}>Buscando eventos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateWrapper}>
          <Ionicons name="alert-circle-outline" size={42} color={colors.purple} />
          <Text style={styles.stateTitle}>Não foi possível carregar</Text>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      );
    }

    if (!events.length) {
      return (
        <View style={styles.stateWrapper}>
          <Ionicons name="calendar-outline" size={42} color={colors.purple} />
          <Text style={styles.stateTitle}>Nenhum evento encontrado</Text>
          <Text style={styles.stateText}>
            Tente buscar por outro artista, evento ou cidade.
          </Text>
        </View>
      );
    }

    return events.map((event) => <EventCard key={event.id} event={event} />);
  }
}

function EventCard({ event }: { event: TicketmasterEvent }) {
  return (
    <View style={styles.card}>
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.eventImage} contentFit="cover" />
      ) : (
        <View style={styles.eventImagePlaceholder}>
          <Ionicons name="musical-notes-outline" size={36} color={colors.purple} />
        </View>
      )}

      <View style={styles.cardContent}>
        <Text style={styles.eventName}>{event.name}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={17} color={colors.purple} />
          <Text style={styles.metaText}>{formatEventDate(event.date)}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={17} color={colors.purple} />
          <Text style={styles.metaText}>
            {event.city} - {event.venue}
          </Text>
        </View>

        {event.url ? (
          <Pressable
            style={styles.ticketmasterButton}
            onPress={() => Linking.openURL(event.url as string)}
          >
            <Ionicons name="open-outline" size={17} color={colors.white} />
            <Text style={styles.ticketmasterButtonText}>Ver evento</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function formatEventDate(date: string) {
  if (!date) {
    return 'Data não informada';
  }

  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
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

  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    marginTop: -24,
  },

  searchBox: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    backgroundColor: colors.white,
  },

  field: {
    marginBottom: 14,
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
    paddingVertical: 13,
  },

  searchActions: {
    flexDirection: 'row',
    gap: 10,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: colors.lilac,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  primaryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  secondaryButtonText: {
    color: colors.purple,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.white,
    marginBottom: 14,
  },

  eventImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.lightLilac,
  },

  eventImagePlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightLilac,
  },

  cardContent: {
    padding: 16,
  },

  eventName: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  metaText: {
    color: colors.black,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },

  ticketmasterButton: {
    backgroundColor: colors.pink,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },

  ticketmasterButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  stateWrapper: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 12,
  },

  stateTitle: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },

  stateText: {
    color: colors.black,
    textAlign: 'center',
    lineHeight: 22,
  },
});
