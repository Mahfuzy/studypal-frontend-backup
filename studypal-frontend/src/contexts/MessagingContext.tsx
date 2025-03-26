import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface MessagingContextType {
  sendMessage: (chatId: string, content: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  messages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;

    // Set up WebSocket connection for real-time messaging
    const ws = new WebSocket(`ws://localhost:3000/ws?userId=${user.id}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleNewMessage(data);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => {
      const chatMessages = prev[message.senderId] || [];
      return {
        ...prev,
        [message.senderId]: [...chatMessages, message],
      };
    });

    // Update unread count if message is not from current user
    if (message.senderId !== user?.id) {
      setUnreadCounts((prev) => ({
        ...prev,
        [message.senderId]: (prev[message.senderId] || 0) + 1,
      }));
    }
  };

  const sendMessage = async (chatId: string, content: string) => {
    if (!user) return;

    try {
      // Replace with your actual API call
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          content,
          senderId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      handleNewMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (chatId: string) => {
    if (!user) return;

    try {
      // Replace with your actual API call
      await fetch(`/api/messages/${chatId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      // Update local state
      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: 0,
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  };

  return (
    <MessagingContext.Provider
      value={{ sendMessage, markAsRead, messages, unreadCounts }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
} 