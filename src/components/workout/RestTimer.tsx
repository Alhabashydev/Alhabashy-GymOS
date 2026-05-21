import { useEffect, useMemo, useState } from 'react';
import { TimerReset, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';

interface RestTimerProps {
  seconds: number;
  active: boolean;
  onClose: () => void;
}

export function RestTimer({ seconds, active, onClose }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (active) setRemaining(seconds);
  }, [active, seconds]);

  useEffect(() => {
    if (!active || remaining <= 0) return;
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [active, remaining]);

  const progress = useMemo(() => {
    if (!seconds) return 100;
    return Math.max(0, Math.min(100, ((seconds - remaining) / seconds) * 100));
  }, [remaining, seconds]);

  if (!active) return null;

  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = Math.floor(remaining % 60).toString().padStart(2, '0');

  return (
    <div className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-md rounded-card border border-white/10 bg-surface/95 p-4 shadow-glowStrong backdrop-blur-xl md:bottom-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Rest timer</p>
          <p className="font-display text-2xl font-bold text-text">{remaining === 0 ? 'Ready' : `${mins}:${secs}`}</p>
        </div>
        <IconButton label="Close timer" onClick={onClose}><X size={18} /></IconButton>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Button variant="secondary" onClick={() => setRemaining((value) => value + 30)}>+30s</Button>
        <Button variant="secondary" onClick={() => setRemaining(seconds)} leftIcon={<TimerReset size={16} />}>Restart</Button>
        <Button onClick={onClose}>Skip</Button>
      </div>
    </div>
  );
}
