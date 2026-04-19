import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { messagesService, authService } from '../api';
import type { Message, User } from '../types';
import { Button, Card, Input, Skeleton } from '../components';
import { ArrowLeft, Send, User as UserIcon } from 'lucide-react';

export const ChatPage = () => {
  const { userId: targetUserId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // We would fetch target user info. Since we don't have a direct mock for any user
    // We'll mock it for now based on what's available
    setTargetUser({
      id: targetUserId!,
      name: 'Пользователь ' + targetUserId?.slice(0, 4),
      email: 'user@example.com',
      city: 'Алматы',
      createdAt: new Date().toISOString(),
    });

    if (currentUser && targetUserId) {
      const fetchMessages = async () => {
        const res = await messagesService.getMessages(currentUser.id, targetUserId);
        if (res.success && res.data) {
          setMessages(res.data);
        }
        setIsLoading(false);
      };

      fetchMessages();

      // Poll every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
    }
  }, [currentUser, targetUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !targetUserId) return;

    const content = newMessage;
    setNewMessage(''); // optimistic clear
    const res = await messagesService.sendMessage(targetUserId, content);
    if (res.success && res.data) {
      setMessages((prev) => [...prev, res.data!]);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Пожалуйста, войдите, чтобы отправлять сообщения.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 h-[calc(100vh-64px)] flex flex-col">
        <Skeleton height={64} className="mb-4" />
        <div className="flex-1 space-y-4">
          <Skeleton height={64} width="60%" className="ml-auto" />
          <Skeleton height={64} width="60%" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 h-[calc(100vh-64px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
            {targetUser?.avatar ? (
              <img src={targetUser.avatar} alt={targetUser.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{targetUser?.name}</h2>
            <p className="text-xs text-slate-500">Был(а) недавно</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              Нет сообщений. Начните общение!
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMine ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
