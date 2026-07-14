'use client';

interface StepperProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function Stepper({ quantity, onQuantityChange, onRemove, disabled = false }: StepperProps) {
  const handleDecrement = () => {
    if (quantity <= 1) {
      onRemove?.();
    } else {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="inline-flex items-center gap-1 bg-surface-container border border-border rounded-full px-1">
      <button
        onClick={handleDecrement}
        disabled={disabled}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low disabled:opacity-50 active:scale-95 transition-all"
        aria-label="Decrease quantity"
      >
        <span className="material-symbols-outlined text-lg">remove</span>
      </button>
      <span className="min-w-8 text-center font-mono font-medium text-fg-0">
        {quantity}
      </span>
      <button
        onClick={handleIncrement}
        disabled={disabled}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low disabled:opacity-50 active:scale-95 transition-all"
        aria-label="Increase quantity"
      >
        <span className="material-symbols-outlined text-lg">add</span>
      </button>
    </div>
  );
}
