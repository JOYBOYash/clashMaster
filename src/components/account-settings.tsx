
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AccountSettingsProps {
  onReset: () => void;
}


export function AccountSettings({ onReset }: AccountSettingsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Load a Different Village</CardTitle>
          <CardDescription>
            Clear the current village data and load a new one using a different Player Tag.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={onReset}>
            Reset and Load New Village
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
