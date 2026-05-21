import { useRef, useState } from 'react';
import { Download, Info, RotateCcw, Upload } from 'lucide-react';
import { useGymStore } from '../hooks/useGymStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input } from '../components/ui/Input';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Select } from '../components/ui/Select';

export function Settings() {
  const { settings, updateSettings, exportBackup, importBackup, resetAllData } = useGymStore();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<unknown>(null);
  const [message, setMessage] = useState('');

  function downloadBackup() {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gymos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleFile(file?: File) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setPendingImport(parsed);
      setImportOpen(true);
      setMessage('');
    } catch {
      setMessage('Invalid JSON file.');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Settings" title="App settings" description="Keep GymOS simple: units, rest timer, backup, import, and reset." />

      <Card className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold text-text">Training settings</h2>
          <p className="mt-1 text-sm text-muted">These apply to new workouts and timer behavior.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Weight unit" value={settings.weightUnit} onChange={(event) => updateSettings({ weightUnit: event.target.value as 'kg' | 'lb' })}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Select>
          <Input label="Default rest seconds" type="number" min={0} value={settings.defaultRestSeconds} onChange={(event) => updateSettings({ defaultRestSeconds: Math.max(0, Number(event.target.value) || 0) })} />
        </div>
        <label className="flex items-center justify-between gap-4 rounded-card border border-white/10 bg-white/[0.03] p-4">
          <span>
            <span className="block font-medium text-text">Show rest timer</span>
            <span className="block text-sm text-muted">Start a simple timer after marking a set done.</span>
          </span>
          <input
            type="checkbox"
            checked={settings.showRestTimer}
            onChange={(event) => updateSettings({ showRestTimer: event.target.checked })}
            className="h-5 w-5 accent-[#A8D8A8]"
          />
        </label>
      </Card>

      <Card className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold text-text">Backup</h2>
          <p className="mt-1 text-sm text-muted">Export or import your LocalStorage data as a JSON file.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={downloadBackup} leftIcon={<Download size={16} />}>Export JSON</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} leftIcon={<Upload size={16} />}>Import JSON</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
        </div>
        {message && <p className="rounded-control border border-danger/25 bg-danger/10 p-3 text-sm text-danger">{message}</p>}
      </Card>

      <Card className="space-y-5 border-danger/20">
        <div>
          <h2 className="font-display text-xl font-bold text-text">Danger zone</h2>
          <p className="mt-1 text-sm text-muted">Reset all LocalStorage data and restore the starter plan.</p>
        </div>
        <Button variant="danger" onClick={() => setResetOpen(true)} leftIcon={<RotateCcw size={16} />}>Reset all data</Button>
      </Card>

      <Card className="flex items-start gap-3">
        <Info className="mt-1 text-accent" size={18} />
        <div>
          <p className="font-medium text-text">GymOS v1.0</p>
          <p className="mt-1 text-sm leading-6 text-muted">Local-only personal gym tracker. No login, no backend, no AI, no social features.</p>
        </div>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all GymOS data?"
        description="This replaces your workout plan with the starter plan and deletes sessions, active workout, body weight entries, and custom settings."
        confirmLabel="Reset data"
        danger
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetAllData();
          setResetOpen(false);
          setMessage('GymOS data reset.');
        }}
      />

      <ConfirmDialog
        open={importOpen}
        title="Import backup and replace current data?"
        description="This will replace your current workout days, history, active session, body weight entries, and settings with the selected backup."
        confirmLabel="Import backup"
        danger
        onCancel={() => {
          setPendingImport(null);
          setImportOpen(false);
        }}
        onConfirm={() => {
          const result = importBackup(pendingImport);
          setImportOpen(false);
          setPendingImport(null);
          setMessage(result.ok ? 'Backup imported successfully.' : result.error);
        }}
      />
    </div>
  );
}
