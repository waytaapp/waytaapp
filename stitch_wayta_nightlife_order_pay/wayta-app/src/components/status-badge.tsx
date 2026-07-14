'use client';

type OrderStatus = 'received' | 'preparing' | 'ready' | 'collected' | 'cancelled' | 'waiting';

interface StatusBadgeProps {
  status: OrderStatus;
  label?: string;
  showIcon?: boolean;
}

const STATUS_CONFIG = {
  received: { color: 'go', icon: 'check_circle', label: 'Received' },
  preparing: { color: 'warn', icon: 'schedule', label: 'Preparing' },
  ready: { color: 'go', icon: 'check_circle', label: 'Ready' },
  collected: { color: 'go', icon: 'check_circle', label: 'Collected' },
  cancelled: { color: 'stop', icon: 'cancel', label: 'Cancelled' },
  waiting: { color: 'warn', icon: 'schedule', label: 'Waiting' },
} as const;

export function StatusBadge({ status, label, showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const displayLabel = label || config.label;

  const colorMap = {
    go: 'bg-go/10 text-go border-go/30',
    warn: 'bg-warn/10 text-warn border-warn/30',
    stop: 'bg-stop/10 text-stop border-stop/30',
  };

  const colorClass = colorMap[config.color];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${colorClass}`}>
      {showIcon && <span className="material-symbols-outlined text-sm">{config.icon}</span>}
      <span>{displayLabel}</span>
    </div>
  );
}

interface WaitingTimeProps {
  minutes: number;
}

export function WaitingTimeBadge({ minutes }: WaitingTimeProps) {
  let status: OrderStatus;

  if (minutes < 3) {
    status = 'ready';
  } else if (minutes <= 8) {
    status = 'waiting';
  } else {
    status = 'cancelled'; // Over limit
  }

  return (
    <StatusBadge
      status={status}
      label={`${minutes}m wait`}
      showIcon={true}
    />
  );
}
