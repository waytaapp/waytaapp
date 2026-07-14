'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Let the hardware/browser back button close the sheet instead of
  // navigating away from the page underneath it.
  useEffect(() => {
    if (!isOpen) return;

    let poppedByUser = false;
    window.history.pushState({ waytaSheet: true }, '');

    const handlePopState = () => {
      poppedByUser = true;
      onCloseRef.current();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (!poppedByUser) {
        window.history.back();
      }
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY.current;

    if (diff > 50) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-[61] max-h-[90vh] rounded-t-2xl bg-surface-container border-t border-border shadow-2xl transition-transform duration-300"
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grab handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 rounded-full bg-border" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] px-4 pb-10">
          {title && (
            <h2 className="text-[20px] font-semibold text-fg-0 mb-4">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </>
  );
}

interface BottomSheetConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

export function BottomSheetConfirm({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
}: BottomSheetConfirmProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-fg-1 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 h-12 rounded-full border border-border bg-surface-container-low text-fg-1 font-medium hover:border-primary transition-colors active:scale-95"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 h-12 rounded-full font-medium transition-all active:scale-95 ${
            isDangerous
              ? 'bg-stop text-white hover:bg-red-600'
              : 'bg-primary text-black hover:bg-accent-hover'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </BottomSheet>
  );
}
