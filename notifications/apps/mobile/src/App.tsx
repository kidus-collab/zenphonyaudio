import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from './hooks/useNotifications';

const SESSION_REMINDERS = [
  { time: '8:00 AM', title: 'NY Session Started', description: 'Get on the charts!' },
  { time: '8:30 AM', title: 'News Release', description: 'Economic news incoming' },
  { time: '9:30 AM', title: 'Indices Open', description: 'US markets now open' },
];

function NotificationCard({ time, title, description }: { time: string; title: string; description: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTime}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.timezoneText}>NY</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function App() {
  const {
    permissionGranted,
    isLoading,
    scheduledCount,
    requestPermissions,
    sendTestNotification,
    refreshSchedule,
    disableNotifications,
  } = useNotifications();

  const handleEnableNotifications = async () => {
    const success = await requestPermissions();
    if (success) {
      Alert.alert('Success', 'Notifications enabled! You will receive trading session reminders.');
    } else {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive trading alerts.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    Alert.alert('Test Sent', 'Check your notification center!');
  };

  const handleDisable = () => {
    Alert.alert(
      'Disable Notifications',
      'Are you sure you want to disable all trading session reminders?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            await disableNotifications();
            Alert.alert('Disabled', 'All notifications have been cancelled.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0d0b14" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Zenphony</Text>
            <Text style={styles.logoAccent}>Trader</Text>
          </View>

          <Text style={styles.subtitle}>Trading Session Reminders</Text>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Notifications</Text>
              {isLoading ? (
                <ActivityIndicator color="#a78bfa" size="small" />
              ) : (
                <View style={[styles.statusBadge, permissionGranted ? styles.statusEnabled : styles.statusDisabled]}>
                  <Text style={styles.statusBadgeText}>{permissionGranted ? 'Enabled' : 'Disabled'}</Text>
                </View>
              )}
            </View>
            {permissionGranted && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Scheduled Reminders</Text>
                <Text style={styles.statusValue}>{scheduledCount}</Text>
              </View>
            )}
          </View>

          {/* Reminder Cards */}
          <Text style={styles.sectionTitle}>Daily Reminders (NY Time)</Text>
          {SESSION_REMINDERS.map((reminder, index) => (
            <NotificationCard key={index} {...reminder} />
          ))}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {!permissionGranted ? (
              <TouchableOpacity style={styles.primaryButton} onPress={handleEnableNotifications} disabled={isLoading}>
                <Text style={styles.primaryButtonText}>Enable Notifications</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleTestNotification}>
                  <Text style={styles.secondaryButtonText}>Send Test Notification</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={refreshSchedule} disabled={isLoading}>
                  <Text style={styles.secondaryButtonText}>Refresh Schedule</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dangerButton} onPress={handleDisable}>
                  <Text style={styles.dangerButtonText}>Disable All</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Open Web App */}
          <TouchableOpacity
            style={styles.webButton}
            onPress={() => Linking.openURL('https://zenphony.audio')}
          >
            <Text style={styles.webButtonText}>Open Zenphony Web App</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            Reminders are scheduled for weekdays only (Mon-Fri)
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0b14',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 20,
    marginBottom: 8,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  logoAccent: {
    fontSize: 32,
    fontWeight: '800',
    color: '#a78bfa',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#888',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusEnabled: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusDisabled: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardTime: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a78bfa',
  },
  timezoneText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#888',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d0b14',
  },
  secondaryButton: {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a78bfa',
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  webButton: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  webButtonText: {
    fontSize: 14,
    color: '#a78bfa',
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 24,
  },
});
