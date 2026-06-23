import colors from '@/constants/colors';
import { Show } from '@/services/show.service';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ShowListScreenProps = {
  children: ReactNode;
  onAddShow: () => void;
};

export function ShowListScreen({ children, onAddShow }: ShowListScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.logoText}>
              Stage<Text style={styles.logoHighlight}>Book</Text>
            </Text>

            <Pressable style={styles.addIconButton} onPress={onAddShow}>
              <Ionicons name="add" size={26} color={colors.white} />
            </Pressable>
          </View>

          <Text style={styles.title}>Meus shows</Text>
          <Text style={styles.subtitle}>
            Reviva suas apresentações favoritas e guarde cada detalhe importante.
          </Text>
        </View>

        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ShowCardProps = {
  show: Show;
};

export function ShowCard({ show }: ShowCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{getDateDay(show.data)}</Text>
          <Text style={styles.dateMonth}>{getDateMonth(show.data)}</Text>
        </View>

        <View style={styles.cardTitleWrapper}>
          <Text style={styles.artist}>{show.artista}</Text>
          <Text style={styles.place}>{show.local}</Text>
        </View>
      </View>

      {show.depoimento ? (
        <Text style={styles.testimonial} numberOfLines={3}>
          {show.depoimento}
        </Text>
      ) : null}

      {show.companhias ? (
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={16} color={colors.purple} />
          <Text style={styles.metaText}>{show.companhias}</Text>
        </View>
      ) : null}
    </View>
  );
}

type EmptyShowsProps = {
  onAddShow: () => void;
};

export function EmptyShows({ onAddShow }: EmptyShowsProps) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="musical-notes-outline" size={44} color={colors.purple} />
      <Text style={styles.emptyTitle}>Nenhum show registrado</Text>
      <Text style={styles.emptyText}>
        Comece adicionando o primeiro show ao seu diário.
      </Text>
      <Pressable style={styles.addButton} onPress={onAddShow}>
        <Ionicons name="add" size={20} color={colors.white} />
        <Text style={styles.addButtonText}>Adicionar show</Text>
      </Pressable>
    </View>
  );
}

export function ShowsLoading() {
  return (
    <View style={styles.stateWrapper}>
      <ActivityIndicator size="large" color={colors.pink} />
      <Text style={styles.stateText}>Carregando shows...</Text>
    </View>
  );
}

type ShowsErrorProps = {
  onRetry: () => void;
};

export function ShowsError({ onRetry }: ShowsErrorProps) {
  return (
    <View style={styles.stateWrapper}>
      <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
      <Pressable style={styles.addButton} onPress={onRetry}>
        <Ionicons name="refresh" size={18} color={colors.white} />
        <Text style={styles.addButtonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

function getDateDay(date: string) {
  const [, , day] = date.split('-');

  return day ?? '--';
}

function getDateMonth(date: string) {
  const [, month] = date.split('-');
  const dateMonth = Number(month) - 1;
  const months = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ];

  return months[dateMonth] ?? '---';
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
    paddingTop: 28,
    paddingBottom: 32,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  logoText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },

  logoHighlight: {
    color: colors.purple,
  },

  addIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: -16,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    backgroundColor: colors.white,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateBadge: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.lightLilac,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  dateDay: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: 'bold',
  },

  dateMonth: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: 'bold',
  },

  cardTitleWrapper: {
    flex: 1,
  },

  artist: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  place: {
    color: colors.purple,
    fontSize: 14,
  },

  testimonial: {
    color: colors.black,
    lineHeight: 20,
    marginTop: 14,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  metaText: {
    color: colors.purple,
    marginLeft: 6,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 54,
    paddingHorizontal: 18,
  },

  emptyTitle: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    color: colors.black,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },

  addButton: {
    backgroundColor: colors.lilac,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  stateWrapper: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  stateText: {
    color: colors.purple,
    marginTop: 14,
  },
});
