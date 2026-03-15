import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Message } from "../api/mockApi";

interface MessageCardProps {
  message: Message;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  handled?: boolean;
}

export default function MessageCard({
  message,
  onApprove,
  onReject,
  handled = false,
}: MessageCardProps) {
  return (
    <View style={styles.card}>
      {/* Sender badge */}
      <View style={styles.senderRow}>
        <View style={styles.senderBadge}>
          <Text style={styles.senderText}>{message.sender}</Text>
        </View>
        {handled && (
          <View style={styles.handledBadge}>
            <Text style={styles.handledBadgeText}>✓ Approved</Text>
          </View>
        )}
      </View>

      {/* Message body */}
      <Text style={styles.messageText}>{message.message}</Text>

      {/* AI Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>{message.aiSummary}</Text>
      </View>

      {/* Action buttons — only shown for incoming */}
      {!handled && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => onApprove?.(message.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>✓  Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => onReject?.(message.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>✕  Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  senderBadge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  senderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  handledBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  handledBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  messageText: {
    fontSize: 14,
    color: "#1E293B",
    lineHeight: 20,
    marginBottom: 10,
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 3,
    borderLeftColor: "#6366F1",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
  },
  summaryText: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#16A34A",
  },
  rejectButton: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
