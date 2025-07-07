
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ManualVillageEditor } from "./manual-village-editor";
import type { VillageState } from "@/lib/constants";

interface AccountSettingsProps {
  villageState: VillageState;
  onUpdate: (newState: VillageState) => void;
  onReset: () => void;
}


export function AccountSettings({ villageState, onUpdate, onReset }: AccountSettingsProps) {
  return (
    <div className="space-y-8">
      <ManualVillageEditor villageState={villageState} onUpdate={onUpdate} />
      
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
