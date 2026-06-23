import {
  EmptyShows,
  ShowCard,
  ShowDetailsModal,
  ShowListScreen,
  ShowsError,
  ShowsLoading,
} from '@/components/panel/ShowListComponents';
import { listShows, Show } from '@/services/show.service';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadShows = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);
      const showsList = await listShows();

      setShows(showsList);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadShows();
    }, [loadShows]),
  );

  function handleAddShow() {
    router.push('/(panel)/add-show/page');
  }

  function renderContent() {
    if (loading) {
      return <ShowsLoading />;
    }

    if (error) {
      return <ShowsError onRetry={loadShows} />;
    }

    if (shows.length === 0) {
      return <EmptyShows onAddShow={handleAddShow} />;
    }

    return shows.map((show) => (
      <ShowCard
        key={show.id}
        show={show}
        onPress={() => setSelectedShow(show)}
      />
    ));
  }

  return (
    <ShowListScreen onAddShow={handleAddShow}>
      {renderContent()}
      <ShowDetailsModal
        show={selectedShow}
        visible={Boolean(selectedShow)}
        onClose={() => setSelectedShow(null)}
      />
    </ShowListScreen>
  );
}
