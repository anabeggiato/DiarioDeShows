import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

type ShowReminderPayload = {
  artist: string;
  date: Date;
};

type NotificationsModule = typeof import('expo-notifications');

export async function scheduleShowReminders({ artist, date }: ShowReminderPayload) {
  if (isAndroidExpoGo()) {
    return 0;
  }

  const Notifications = await loadNotifications();

  await configureNotificationChannel(Notifications);

  const hasPermission = await requestNotificationPermission(Notifications);

  if (!hasPermission) {
    return 0;
  }

  const reminders = buildShowReminders(artist, date);

  await Promise.all(
    reminders.map((reminder) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          data: {
            artist,
            type: reminder.type,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminder.date,
          channelId: 'show-reminders',
        },
      }),
    ),
  );

  return reminders.length;
}

async function loadNotifications() {
  const Notifications = await import('expo-notifications');

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  return Notifications;
}

async function requestNotificationPermission(Notifications: NotificationsModule) {
  const currentPermissions = await Notifications.getPermissionsAsync();

  if (currentPermissions.granted) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();

  return requestedPermissions.granted;
}

async function configureNotificationChannel(Notifications: NotificationsModule) {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('show-reminders', {
    name: 'Lembretes de shows',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  });
}

function isAndroidExpoGo() {
  return (
    Platform.OS === 'android' &&
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  );
}

function buildShowReminders(artist: string, showDate: Date) {
  const now = new Date();
  const showReminderDate = new Date(showDate);
  const memoryReminderDate = new Date(showDate);

  showReminderDate.setDate(showReminderDate.getDate() - 1);
  showReminderDate.setHours(18, 0, 0, 0);

  memoryReminderDate.setDate(memoryReminderDate.getDate() + 1);
  memoryReminderDate.setHours(10, 0, 0, 0);

  return [
    {
      type: 'upcoming-show',
      date: showReminderDate,
      title: 'Show chegando',
      body: `Amanhã tem ${artist}. Separe ingresso, rota e companhia.`,
    },
    {
      type: 'memory-reminder',
      date: memoryReminderDate,
      title: 'Registre sua memória',
      body: `Como foi o show de ${artist}? Complete seu StageBook com os detalhes.`,
    },
  ].filter((reminder) => reminder.date > now);
}
