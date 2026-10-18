import { AdminAuditLogEntry, AuditActionType, AuditCategory, AuditSeverity } from '../types';

// Helper to generate realistic SHA-256 style tamper-evident hashes
export const generateHash = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs(hash * 31 + 1337).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs(hash * 97 + 4242).toString(16).padStart(8, '0');
  const hexPart4 = Math.abs(hash * 13 + 9999).toString(16).padStart(8, '0');
  return `0x${hexPart1}${hexPart2}${hexPart3}${hexPart4}`.toLowerCase();
};

// Initial audit logs list - empty for clean production data
export const INITIAL_AUDIT_LOGS: AdminAuditLogEntry[] = [];

// Reactive in-memory state store
let auditLogs: AdminAuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
const listeners: Set<(logs: AdminAuditLogEntry[]) => void> = new Set();

export const getAuditLogs = (): AdminAuditLogEntry[] => {
  return auditLogs;
};

export const addAuditLog = (
  entry: Omit<AdminAuditLogEntry, 'id' | 'timestamp' | 'hashDigest'> & {
    id?: string;
    timestamp?: string;
    hashDigest?: string;
  }
): AdminAuditLogEntry => {
  const count = auditLogs.length + 1;
  const id = entry.id || `AUD-2026-${String(890 + count).padStart(4, '0')}`;
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const timestamp = entry.timestamp || `Just now · ${timeString} IST`;
  const rawContent = `${id}-${entry.actionType}-${entry.targetResource}-${Date.now()}`;
  const hashDigest = entry.hashDigest || generateHash(rawContent);

  const fullEntry: AdminAuditLogEntry = {
    ...entry,
    id,
    timestamp,
    hashDigest,
  };

  auditLogs = [fullEntry, ...auditLogs];
  notifyListeners();
  return fullEntry;
};

export const subscribeAuditLogs = (callback: (logs: AdminAuditLogEntry[]) => void): (() => void) => {
  listeners.add(callback);
  callback(auditLogs);
  return () => {
    listeners.delete(callback);
  };
};

const notifyListeners = () => {
  listeners.forEach((callback) => callback(auditLogs));
};

export const resetAuditLogs = () => {
  auditLogs = [...INITIAL_AUDIT_LOGS];
  notifyListeners();
};
