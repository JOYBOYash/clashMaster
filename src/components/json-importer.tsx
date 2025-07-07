
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { VillageState } from '@/lib/constants';
import { mapJsonToVillageState } from '@/lib/data-mapper';

interface JsonImporterProps {
  onDataLoaded: (data: VillageState) => void;
}

export function JsonImporter({ onDataLoaded }: JsonImporterProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    setIsLoading(true);
    setError(null);
    
    if (!jsonInput.trim()) {
        setError("The text area is empty. Please paste your village's JSON data.");
        setIsLoading(false);
        return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      const villageState = mapJsonToVillageState(parsedJson);
      onDataLoaded(villageState);
    } catch (e: any) {
      console.error("JSON parsing or mapping error:", e);
      setError(e.message || 'An unexpected error occurred during import. Please ensure you copied the entire JSON file correctly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            <UploadCloud className="w-8 h-8 mr-3 text-primary" />
            Import Your Village Data
        </CardTitle>
        <CardDescription>
          From the Clash of Clans app, go to Settings &gt; More Settings, then find the 'Export Village data in JSON format' option and click 'Copy'. Paste the copied text into the box below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           <Textarea 
            placeholder='{"tag":"#GU82PJVGJ", ...'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[250px] font-mono text-xs"
            aria-label="Village JSON Input"
           />
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Import Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleImport} disabled={isLoading} className="w-full text-lg py-6">
          {isLoading ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <UploadCloud className="mr-3" />
          )}
          Load My Village
        </Button>
      </CardFooter>
    </Card>
  );
}
