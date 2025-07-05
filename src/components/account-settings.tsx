
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VillageState, VillageStateSchema, ALL_BUILDINGS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Building } from "@/lib/constants";

interface AccountSettingsProps {
  villageState: VillageState;
  onUpdate: (data: VillageState) => void;
}

export function AccountSettings({ villageState, onUpdate }: AccountSettingsProps) {
  const form = useForm<VillageState>({
    resolver: zodResolver(VillageStateSchema),
    defaultValues: villageState,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "buildings",
  });

  const onSubmit = (data: VillageState) => {
    onUpdate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Account Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="townHallLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Town Hall Level</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="builderHallLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Builder Hall Level</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            <h3 className="text-lg font-semibold font-headline">Resources</h3>
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

            <Separator />
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold font-headline">Buildings</h3>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ id: `new_${Date.now()}`, name: 'Cannon', level: 1, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: false })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Building
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <FormField
                        control={form.control}
                        name={`buildings.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                             <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                const buildingConfig = ALL_BUILDINGS_CONFIG.find(b => b.name === value);
                                if (buildingConfig) {
                                  form.setValue(`buildings.${index}.type`, buildingConfig.type as Building['type']);
                                  form.setValue(`buildings.${index}.base`, buildingConfig.base as Building['base']);
                                  form.setValue(`buildings.${index}.maxLevel`, buildingConfig.maxLevel);
                                }
                              }} 
                              value={field.value}
                             >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select building" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ALL_BUILDINGS_CONFIG.map(b => <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <FormField
                      control={form.control}
                      name={`buildings.${index}.level`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`buildings.${index}.base`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled>
                            <FormControl>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="builder">Builder</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="self-end justify-self-end">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
