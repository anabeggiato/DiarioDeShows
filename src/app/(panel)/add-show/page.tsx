import {
  CoverPickerField,
  DatePickerField,
  FormInput,
  PanelScreen,
  PrimaryButton,
} from '@/components/panel/ShowFormComponents';
import { scheduleShowReminders } from '@/services/notification.service';
import { createShow, uploadShowCover } from '@/services/show.service';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function CreateShow() {
  const [artist, setArtist] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [place, setPlace] = useState('');
  const [companions, setCompanions] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [setlist, setSetlist] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!artist.trim() || !date || !place.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha artista, data e local do show.');
      return;
    }

    try {
      setLoading(true);

      const coverUrl = cover ? await uploadShowCover(cover) : '';

      await createShow({
        artista: artist.trim(),
        data: formatDateForDatabase(date),
        local: place.trim(),
        companhias: companions.trim(),
        depoimento: testimonial.trim(),
        setlist: setlist.trim(),
        capa: coverUrl,
      });

      let scheduledReminders = 0;
      let reminderFailed = false;

      try {
        scheduledReminders = await scheduleShowReminders({
          artist: artist.trim(),
          date,
        });
      } catch {
        reminderFailed = true;
      }

      Alert.alert('Show salvo', getSuccessMessage(scheduledReminders, reminderFailed), [
        {
          text: 'OK',
          onPress: () => router.replace('/(panel)/home/page'),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o show agora.';

      Alert.alert('Erro ao salvar', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PanelScreen
      title="Adicionar show"
      subtitle="Registre os detalhes da apresentação para guardar essa memória no seu diário."
      showBackButton
    >
      <FormInput
        label="Artista"
        placeholder="Nome do artista ou banda"
        value={artist}
        onChangeText={setArtist}
      />

      <DatePickerField
        label="Data do show"
        value={date}
        onChange={setDate}
        placeholder="Data em que ocorreu o show"
      />

      <FormInput
        label="Local do show"
        placeholder="Local em que ocorreu o show"
        value={place}
        onChangeText={setPlace}
      />

      <FormInput
        label="Companhias"
        placeholder="Com quem você assistiu ao show"
        value={companions}
        onChangeText={setCompanions}
      />

      <FormInput
        label="Depoimento"
        placeholder="Memórias, sentimentos, detalhes..."
        value={testimonial}
        onChangeText={setTestimonial}
        multiline
      />

      <FormInput
        label="Setlist"
        placeholder="Quais músicas tocaram nessa data"
        value={setlist}
        onChangeText={setSetlist}
        multiline
      />

      <CoverPickerField
        label="Capa"
        value={cover}
        onChange={setCover}
      />

      <PrimaryButton title="Adicionar show" loading={loading} onPress={handleSave} />
    </PanelScreen>
  );
}

function formatDateForDatabase(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getSuccessMessage(scheduledReminders: number, reminderFailed: boolean) {
  if (reminderFailed) {
    return 'Sua memória foi adicionada ao diário, mas não foi possível agendar os lembretes.';
  }

  if (scheduledReminders > 0) {
    return 'Sua memória foi adicionada ao diário e os lembretes foram agendados.';
  }

  return 'Sua memória foi adicionada ao diário.';
}
