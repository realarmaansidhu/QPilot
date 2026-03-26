'use client';

import { useState } from 'react';
import { Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LLMProvider } from '@/types/user';

interface ApiKeyInputProps {
  onSave: (provider: LLMProvider, key: string) => Promise<void>;
}

const PROVIDERS: { value: LLMProvider; label: string; placeholder: string }[] = [
  { value: 'openai',    label: 'OpenAI',    placeholder: 'sk-...' },
  { value: 'anthropic', label: 'Anthropic',  placeholder: 'sk-ant-...' },
  { value: 'google',    label: 'Google AI',  placeholder: 'AIza...' },
];

/** Form for entering and verifying LLM API keys */
export function ApiKeyInput({ onSave }: ApiKeyInputProps) {
  const [provider, setProvider] = useState<LLMProvider>('openai');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!key.trim()) return;
    setSaving(true);
    try {
      await onSave(provider, key.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  const currentProvider = PROVIDERS.find(p => p.value === provider)!;

  return (
    <div className="space-y-4">
      {/* Provider selector */}
      <div>
        <Label>LLM Provider</Label>
        <div className="flex gap-2 mt-1.5">
          {PROVIDERS.map(p => (
            <Button
              key={p.value}
              variant={provider === p.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setProvider(p.value); setKey(''); setSaved(false); }}
              className={provider === p.value ? 'bg-[#00D4AA] text-[#0A1628]' : ''}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* API Key input */}
      <div>
        <Label>API Key</Label>
        <div className="relative mt-1.5">
          <Input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={e => { setKey(e.target.value); setSaved(false); }}
            placeholder={currentProvider.placeholder}
            className="pr-10 bg-white/5 border-white/10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Save button */}
      <Button onClick={handleSave} disabled={!key.trim() || saving} className="bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : saved ? <CheckCircle className="h-4 w-4 mr-2" /> : null}
        {saved ? 'Saved!' : 'Save API Key'}
      </Button>
    </div>
  );
}
