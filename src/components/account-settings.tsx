
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VillageStateSchema, type VillageState } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { z } from 'zod';

interface AccountSettingsProps {
  villageState: VillageState;
  onUpdate: (data: VillageState) => void;
  onReset: () => void;
}

// We only want to validate the parts of the state this form can change.
const SettingsFormSchema = VillageStateSchema.pick({ resources: true });

export function AccountSettings({ villageState, onUpdate, onReset }: AccountSettingsProps) {
  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      resources: villageState.resources,
    },
  });

  const onSubmit = (data: z.infer<typeof SettingsFormSchema>) => {
    // Merge the updated resources back into the full village state
    const updatedState = { ...villageState, resources: data.resources };
    onUpdate(updatedState);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Resource Management</CardTitle>
          <CardDescription>Update your current resource counts for more accurate suggestions. The CoC API does not provide this automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                  control={form.control}
                  name="resources.gold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gold</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="resources.elixir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elixir</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="resources.darkElixir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dark Elixir</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">Save Resources</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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
