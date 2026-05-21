import { useRef, useState } from 'react';
import { Download, Info, Languages, RotateCcw, Upload } from 'lucide-react';
import { useGymStore } from '../hooks/useGymStore';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input } from '../components/ui/Input';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Select } from '../components/ui/Select';
import type { Language } from '../i18n';

export function Settings() {
  const { settings, updateSettings, exportBackup, importBackup, resetAllData } = useGymStore();
  const { t, setLanguage, toggleLanguage } = useLanguage();
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
      setMessage(t('settings.invalidJson'));
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow={t('settings.eyebrow')} title={t('settings.title')} description={t('settings.description')} />

      <Card className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold text-text">{t('settings.trainingTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('settings.trainingDescription')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label={t('settings.weightUnit')} value={settings.weightUnit} onChange={(event) => updateSettings({ weightUnit: event.target.value as 'kg' | 'lb' })}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Select>
          <Input label={t('settings.defaultRest')} type="number" min={0} value={settings.defaultRestSeconds} onChange={(event) => updateSettings({ defaultRestSeconds: Math.max(0, Number(event.target.value) || 0) })} />
        </div>
        <label className="flex items-center justify-between gap-4 rounded-card border border-white/10 bg-white/[0.03] p-4">
          <span>
            <span className="block font-medium text-text">{t('settings.showTimer')}</span>
            <span className="block text-sm text-muted">{t('settings.showTimerDescription')}</span>
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
        <div className="flex items-start gap-3">
          <Languages className="mt-1 text-accent" size={18} />
          <div>
            <h2 className="font-display text-xl font-bold text-text">{t('settings.languageTitle')}</h2>
            <p className="mt-1 text-sm text-muted">{t('settings.languageDescription')}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Select label={t('common.language')} value={settings.language} onChange={(event) => setLanguage(event.target.value as Language)}>
            <option value="en">{t('common.english')}</option>
            <option value="ar">{t('common.arabic')}</option>
          </Select>
          <Button variant="secondary" className="self-end" onClick={toggleLanguage} leftIcon={<Languages size={16} />}>
            {settings.language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>
      </Card>

      <Card className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold text-text">{t('settings.backupTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('settings.backupDescription')}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={downloadBackup} leftIcon={<Download size={16} />}>{t('settings.export')}</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} leftIcon={<Upload size={16} />}>{t('settings.import')}</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
        </div>
        {message && <p className="rounded-control border border-danger/25 bg-danger/10 p-3 text-sm text-danger">{message}</p>}
      </Card>

      <Card className="space-y-5 border-danger/20">
        <div>
          <h2 className="font-display text-xl font-bold text-text">{t('settings.dangerTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('settings.dangerDescription')}</p>
        </div>
        <Button variant="danger" onClick={() => setResetOpen(true)} leftIcon={<RotateCcw size={16} />}>{t('settings.reset')}</Button>
      </Card>

      <Card className="flex items-start gap-3">
        <Info className="mt-1 text-accent" size={18} />
        <div>
          <p className="font-medium text-text">{t('settings.infoTitle')}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{t('settings.infoDescription')}</p>
        </div>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        title={t('settings.resetTitle')}
        description={t('settings.resetDescription')}
        confirmLabel={t('settings.resetConfirm')}
        danger
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetAllData();
          setResetOpen(false);
          setMessage(t('settings.resetDone'));
        }}
      />

      <ConfirmDialog
        open={importOpen}
        title={t('settings.importTitle')}
        description={t('settings.importDescription')}
        confirmLabel={t('settings.importConfirm')}
        danger
        onCancel={() => {
          setPendingImport(null);
          setImportOpen(false);
        }}
        onConfirm={() => {
          const result = importBackup(pendingImport);
          setImportOpen(false);
          setPendingImport(null);
          setMessage(result.ok ? t('settings.importDone') : result.error);
        }}
      />
    </div>
  );
}
