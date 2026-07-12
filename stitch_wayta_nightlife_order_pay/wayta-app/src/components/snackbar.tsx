'use client';

import { useEffect, useState } from 'react';

export type SnackbarType = 'neutral' | 'go' | 'warn' | 'stop';

export interface SnackbarMessage {
  id: string;
  title: string;
  action?: { label: string; onPress: () => void };
  duration?: number;
  type?: SnackbarType;
}

let nextId = 0;
const generateId = () => `snackbar-${nextId++}`;

export const createSnackbar = (() => {
  let listeners: ((message: SnackbarMessage) => void)[] = [];

  return {
    show: (
      title: string,
      options?: {
        action?: { label: string; onPress: () => void };
        duration?: number;
        type?: SnackbarType;
      }
    ) => {
      const message: SnackbarMessage = {
        id: generateId(),
        title,
        action: options?.action,
        duration: options?.duration ?? 4000,
        type: options?.type ?? 'neutral',
      };
      listeners.forEach((listener) => listener(message));
      return message.id;
    },
    subscribe: (listener: (message: SnackbarMessage) => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };
})();

interface SnackbarProps {
  message: SnackbarMessage;
  onDismiss: () => void;
}

function SnackbarItem({ message, onDismiss }: SnackbarProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (message.duration === Infinity) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 200);
    }, message.duration);

    return () => clearTimeout(timer);
  }, [message.duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  };

  const colorClasses = {
    neutral: 'bg-surface-container border-border',
    go: 'bg-go/10 border-go/30',
    warn: 'bg-warn/10 border-warn/30',
    stop: 'bg-stop/10 border-stop/30',
  };

  const textColorClasses = {
    neutral: 'text-fg-1',
    go: 'text-go',
    warn: 'text-warn',
    stop: 'text-stop',
  };

  return (
    <div
      className={`${colorClasses[message.type || 'neutral']} border rounded-lg px-4 py-3 mb-3 transform transition-all duration-200 ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <p className={`text-sm font-medium flex-1 ${textColorClasses[message.type || 'neutral']}`}>
          {message.title}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {message.action && (
            <button
              onClick={() => {
                message.action?.onPress();
                handleDismiss();
              }}
              className="text-xs font-semibold text-primary hover:text-accent-hover active:scale-95 transition-all"
            >
              {message.action.label}
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center hover:bg-surface-container/50 rounded transition-colors active:scale-95"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface SnackbarContainerProps {
  messages: SnackbarMessage[];
  onRemove: (id: string) => void;
}

export function SnackbarContainer({ messages, onRemove }: SnackbarContainerProps) {
  return (
    <div className="fixed bottom-24 left-3 right-3 z-50 max-w-sm pointer-events-auto">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id} className="pointer-events-auto">
            <SnackbarItem message={message} onDismiss={() => onRemove(message.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function useSnackbar() {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  useEffect(() => {
    return createSnackbar.subscribe((message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return {
    messages,
    removeMessage,
    show: createSnackbar.show,
  };
}
