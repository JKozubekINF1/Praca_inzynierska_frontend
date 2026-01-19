import { ref, push, onValue, off, get, update } from 'firebase/database';
import { db } from '../config/firebase';

export interface ChatMessage {
  id?: string;
  senderId: number;
  senderName: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface ChatSummary {
  roomId: string;
  announcementId: number;
  buyerId: number;
  sellerId: number;
  lastMessage?: ChatMessage;
}

export const getChatRoomId = (announcementId: number, buyerId: number, sellerId: number) => {
  return `chat_${announcementId}_${buyerId}_${sellerId}`;
};

export const chatService = {
  sendMessage: async (roomId: string, senderId: number, senderName: string, text: string) => {
    const messagesRef = ref(db, `chats/${roomId}/messages`);
    await push(messagesRef, {
      senderId,
      senderName,
      text,
      timestamp: Date.now(),
      isRead: false,
    });
  },

  subscribeToChat: (roomId: string, callback: (messages: ChatMessage[]) => void) => {
    const messagesRef = ref(db, `chats/${roomId}/messages`);

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages: ChatMessage[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          loadedMessages.push({ id: key, ...data[key] });
        });
      }
      callback(loadedMessages);
    });

    return () => off(messagesRef);
  },

  markMessagesAsRead: async (roomId: string, currentUserId: number) => {
    const messagesRef = ref(db, `chats/${roomId}/messages`);
    const snapshot = await get(messagesRef);
    const data = snapshot.val();

    if (data) {
      const updates: Record<string, any> = {};
      Object.keys(data).forEach((key) => {
        const msg = data[key];
        if (msg.senderId !== currentUserId && !msg.isRead) {
          updates[`/${key}/isRead`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(messagesRef, updates);
      }
    }
  },

  subscribeToTotalUnreadCount: (userId: number, callback: (count: number) => void) => {
    const chatsRef = ref(db, 'chats');

    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      let totalUnread = 0;

      if (data) {
        Object.keys(data).forEach((chatKey) => {
          const parts = chatKey.split('_');
          if (parts.length === 4) {
            const buyerId = parseInt(parts[2]);
            const sellerId = parseInt(parts[3]);

            if (buyerId === userId || sellerId === userId) {
              const messages = data[chatKey].messages;
              if (messages) {
                Object.values(messages).forEach((msg: any) => {
                  if (msg.senderId !== userId && !msg.isRead) {
                    totalUnread++;
                  }
                });
              }
            }
          }
        });
      }
      callback(totalUnread);
    });

    return () => off(chatsRef);
  },

  getMyChats: async (userId: number): Promise<ChatSummary[]> => {
    const chatsRef = ref(db, 'chats');
    const snapshot = await get(chatsRef);
    const data = snapshot.val();

    if (!data) return [];

    const myChats: ChatSummary[] = [];
    Object.keys(data).forEach((key) => {
      const parts = key.split('_');
      if (parts.length === 4) {
        const announcementId = parseInt(parts[1]);
        const buyerId = parseInt(parts[2]);
        const sellerId = parseInt(parts[3]);
        if (buyerId === userId || sellerId === userId) {
          const messages = data[key].messages;
          let lastMsg = null;
          if (messages) {
            const msgKeys = Object.keys(messages);
            const lastKey = msgKeys[msgKeys.length - 1];
            lastMsg = messages[lastKey];
          }

          myChats.push({
            roomId: key,
            announcementId,
            buyerId,
            sellerId,
            lastMessage: lastMsg,
          });
        }
      }
    });

    return myChats;
  },
};
