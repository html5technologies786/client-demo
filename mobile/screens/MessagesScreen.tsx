import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { getMessages, Message } from "../api/mockApi";
import MessageCard from "../components/MessageCard";

export default function MessagesScreen() {
  const [incoming, setIncoming] = useState<Message[]>([]);
  const [handled, setHandled] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMessages().then((messages) => {
      setIncoming(messages);
      setLoading(false);
    });
  }, []);

  const handleApprove = (id: string) => {
    const message = incoming.find((m) => m.id === id);
    if (!message) return;
    setIncoming((prev) => prev.filter((m) => m.id !== id));
    setHandled((prev) => [message, ...prev]);
  };

  const handleReject = (id: string) => {
    setIncoming((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* App header */}
        <Text style={styles.appTitle}>Message Approvals</Text>

        {/* ── SECTION 1: Incoming ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Incoming Messages</Text>
          {!loading && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{incoming.length}</Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Fetching messages…</Text>
          </View>
        ) : incoming.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>All clear!</Text>
            <Text style={styles.emptySubtitle}>No incoming messages to review.</Text>
          </View>
        ) : (
          incoming.map((msg) => (
            <MessageCard
              key={msg.id}
              message={msg}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}

        {/* ── SECTION 2: Handled ── */}
        <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
          <Text style={styles.sectionTitle}>Handled</Text>
          {handled.length > 0 && (
            <View style={[styles.countBadge, styles.countBadgeGreen]}>
              <Text style={styles.countText}>{handled.length}</Text>
            </View>
          )}
        </View>

        {handled.length === 0 ? (
          <View style={styles.emptyBoxSmall}>
            <Text style={styles.emptySubtitle}>Approved messages will appear here.</Text>
          </View>
        ) : (
          handled.map((msg) => (
            <MessageCard key={msg.id} message={msg} handled />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 24,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionHeaderSpaced: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#334155",
  },
  countBadge: {
    backgroundColor: "#6366F1",
    borderRadius: 20,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  countBadgeGreen: {
    backgroundColor: "#16A34A",
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  loadingBox: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 36,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94A3B8",
  },
  emptyBoxSmall: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
