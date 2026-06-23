import colors from '@/constants/colors';
import { Show } from '@/services/show.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
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
  onOpenUpcomingShows?: () => void;
};

export function ShowListScreen({
  children,
  onAddShow,
  onOpenUpcomingShows,
}: ShowListScreenProps) {
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

            <View style={styles.headerActions}>
              {onOpenUpcomingShows ? (
                <Pressable style={styles.headerIconButton} onPress={onOpenUpcomingShows}>
                  <Ionicons name="calendar-outline" size={23} color={colors.white} />
                </Pressable>
              ) : null}

              <Pressable style={styles.headerIconButton} onPress={onAddShow}>
                <Ionicons name="add" size={26} color={colors.white} />
              </Pressable>
            </View>
          </View>

          <Text style={styles.title}>Meus shows</Text>
          <Text style={styles.subtitle}>
            Reviva suas apresentações favoritas e guarde cada detalhe importante.
          </Text>
        </View>

        <View style={styles.content}>
          {onOpenUpcomingShows ? (
            <Pressable style={styles.upcomingButton} onPress={onOpenUpcomingShows}>
              <Ionicons name="calendar-outline" size={19} color={colors.purple} />
              <Text style={styles.upcomingButtonText}>Ver próximos shows</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.purple} />
            </Pressable>
          ) : null}

          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ShowCardProps = {
  show: Show;
  onPress: () => void;
};

export function ShowCard({ show, onPress }: ShowCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {show.capa ? (
        <Image source={{ uri: show.capa }} style={styles.coverImage} contentFit="cover" />
      ) : null}

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
    </Pressable>
  );
}

type ShowDetailsModalProps = {
  show: Show | null;
  visible: boolean;
  onClose: () => void;
};

export function ShowDetailsModal({ show, visible, onClose }: ShowDetailsModalProps) {
  if (!show) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailsCard}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false}>
            {show.capa ? (
              <Image
                source={{ uri: show.capa }}
                style={styles.detailsCover}
                contentFit="cover"
              />
            ) : (
              <View style={styles.detailsCoverPlaceholder}>
                <Ionicons name="musical-notes-outline" size={42} color={colors.purple} />
              </View>
            )}

            <View style={styles.detailsContent}>
              <Text style={styles.detailsArtist}>{show.artista}</Text>

              <View style={styles.detailsMeta}>
                <Ionicons name="calendar-outline" size={18} color={colors.purple} />
                <Text style={styles.detailsMetaText}>{formatFullDate(show.data)}</Text>
              </View>

              <View style={styles.detailsMeta}>
                <Ionicons name="location-outline" size={18} color={colors.purple} />
                <Text style={styles.detailsMetaText}>{show.local}</Text>
              </View>

              <DetailSection
                title="Companhias"
                icon="people-outline"
                content={show.companhias}
              />
              <DetailSection
                title="Depoimento"
                icon="chatbubble-ellipses-outline"
                content={show.depoimento}
              />
              <DetailSection
                title="Setlist"
                icon="list-outline"
                content={show.setlist}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type DetailSectionProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content?: string | null;
};

function DetailSection({ title, icon, content }: DetailSectionProps) {
  if (!content) {
    return null;
  }

  return (
    <View style={styles.detailSection}>
      <View style={styles.detailSectionHeader}>
        <Ionicons name={icon} size={18} color={colors.purple} />
        <Text style={styles.detailSectionTitle}>{title}</Text>
      </View>
      <Text style={styles.detailSectionText}>{content}</Text>
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

function formatFullDate(date: string) {
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

  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },

  headerIconButton: {
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

  upcomingButton: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  upcomingButtonText: {
    color: colors.purple,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },

  coverImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.lightLilac,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 22,
  },

  detailsCard: {
    maxHeight: '88%',
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
  },

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsCover: {
    width: '100%',
    height: 220,
    backgroundColor: colors.lightLilac,
  },

  detailsCoverPlaceholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightLilac,
  },

  detailsContent: {
    padding: 20,
  },

  detailsArtist: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  detailsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  detailsMetaText: {
    color: colors.black,
    marginLeft: 8,
    flex: 1,
  },

  detailSection: {
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingTop: 16,
    marginTop: 12,
  },

  detailSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  detailSectionTitle: {
    color: colors.purple,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  detailSectionText: {
    color: colors.black,
    lineHeight: 21,
  },
});
