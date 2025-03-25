import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { FiSend, FiPaperclip, FiSmile, FiMoreVertical, FiArrowLeft, FiSearch, FiFilter } from 'react-icons/fi';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  message_type?: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  online: boolean;
}

export default function MessagingPage() {
  const { user } = useAuth();
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showUserList, setShowUserList] = useState(!chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Fetch messages and users
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [messagesRes, usersRes] = await Promise.all([
          axios.get<Message[]>('http://localhost:3000/messages'),
          axios.get<User[]>('http://localhost:3000/users')
        ]);

        if (!isMounted) return;

        setMessages(messagesRes.data);

        // Transform users data to include last message and unread count
        const transformedUsers = usersRes.data.map((dbUser: User) => {
          const userMessages = messagesRes.data.filter(
            (msg: Message) => msg.sender_id === dbUser.id || msg.receiver_id === dbUser.id
          );
          const lastMessage = userMessages[userMessages.length - 1];
          const unreadCount = userMessages.filter(
            (msg: Message) => msg.receiver_id === user?.id && !msg.read
          ).length;

          return {
            id: dbUser.id,
            name: dbUser.name,
            avatar: dbUser.avatar || `https://i.pravatar.cc/150?img=${dbUser.id}`,
            lastMessage: lastMessage?.content,
            lastMessageTime: lastMessage ? new Date(lastMessage.timestamp) : undefined,
            unreadCount,
            online: Math.random() > 0.5 // Mock online status
          };
        });

        setUsers(transformedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Memoized chat messages
  const chatMessages = useMemo(() => {
    if (!chatId) return [];
    return messages.filter(
      msg => (msg.sender_id === user?.id && msg.receiver_id === chatId) ||
             (msg.sender_id === chatId && msg.receiver_id === user?.id)
    );
  }, [messages, chatId, user?.id]);

  // Debounced mark as read function
  const debouncedMarkAsRead = useCallback(
    debounce(async (messagesToUpdate: Message[]) => {
      try {
        await Promise.all(
          messagesToUpdate.map(msg =>
            axios.patch(`http://localhost:3000/messages/${msg.id}`, { read: true })
          )
        );

        setMessages(prev =>
          prev.map(msg =>
            messagesToUpdate.some(m => m.id === msg.id) ? { ...msg, read: true } : msg
          )
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (chatId) {
      const messagesToUpdate = messages
        .filter(msg => msg.sender_id === chatId && msg.receiver_id === user?.id && !msg.read);

      if (messagesToUpdate.length > 0) {
        debouncedMarkAsRead(messagesToUpdate);
      }
    }
  }, [chatId, messages, user?.id, debouncedMarkAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user) return;

    try {
      const messageData = {
        sender_id: user.id,
        receiver_id: chatId,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false
      };

      const response = await axios.post('http://localhost:3000/messages', messageData);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log('File selected:', file);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowUserList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const renderUserList = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((chatUser) => (
          <div
            key={chatUser.id}
            onClick={() => {
              navigate(`/messages/${chatUser.id}`);
              if (isMobile) {
                setShowUserList(false);
              }
            }}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
              chatId === chatUser.id ? 'bg-purple-50' : ''
            }`}
          >
            <div className="relative">
              <img
                src={chatUser.avatar}
                alt={chatUser.name}
                className="w-12 h-12 rounded-full"
              />
              {chatUser.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{chatUser.name}</h3>
                <span className="text-sm text-gray-500">
                  {chatUser.lastMessageTime && formatDistanceToNow(chatUser.lastMessageTime, { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600 truncate">{chatUser.lastMessage || 'No messages yet'}</p>
                {chatUser.unreadCount > 0 && (
                  <span className="ml-2 bg-purple-600 text-white text-xs rounded-full px-2 py-1">
                    {chatUser.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChat = () => {
    const currentUser = users.find(u => u.id === chatId);
    if (!currentUser) return null;

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex items-center">
          {isMobile && (
            <button
              onClick={() => {
                setShowUserList(true);
                navigate('/messages');
              }}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center flex-1">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <h3 className="font-medium">{currentUser.name}</h3>
              <p className="text-sm text-gray-500">
                {currentUser.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === user?.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs mt-1 block opacity-75">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiPaperclip className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiSmile className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white">
      {isMobile ? (
        <div className="h-full">
          {showUserList ? renderUserList() : renderChat()}
        </div>
      ) : (
        <div className="h-full flex">
          <div className="w-1/3 border-r">{renderUserList()}</div>
          <div className="flex-1">{renderChat()}</div>
        </div>
      )}
    </div>
  );
}