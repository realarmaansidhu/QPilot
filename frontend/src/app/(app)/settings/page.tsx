'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiKeyInput } from '@/components/common/ApiKeyInput';
import type { LLMProvider } from '@/types/user';

/** Settings page — profile, API keys, billing */
export default function SettingsPage() {
  async function handleSaveKey(provider: LLMProvider, key: string) {
    // TODO: Save encrypted key to Supabase via backend
    console.log('Saving key for', provider);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, API keys, and billing.</p>
      </div>

      <Tabs defaultValue="api-keys">
        <TabsList className="bg-white/5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information.</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Profile management coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardHeader>
              <CardTitle>LLM API Keys</CardTitle>
              <CardDescription>
                QPilot uses your own API keys for AI analysis. Keys are encrypted and stored securely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyInput onSave={handleSaveKey} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Current plan: <span className="text-foreground font-medium">Free</span></p>
              <Button className="bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
