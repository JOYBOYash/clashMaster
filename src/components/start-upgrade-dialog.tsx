
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Building } from "@/lib/constants";

interface StartUpgradeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  building: Building;
  onStartUpgrade: (buildingId: string, days: number, hours: number, minutes: number) => void;
}

const UpgradeFormSchema = z.object({
  days: z.number().min(0).max(30).default(0),
  hours: z.number().min(0).max(23).default(0),
  minutes: z.number().min(0).max(59).default(0),
}).refine(data => data.days > 0 || data.hours > 0 || data.minutes > 0, {
    message: "Upgrade duration must be greater than 0.",
    path: ["days"],
});

type UpgradeFormValues = z.infer<typeof UpgradeFormSchema>;

export function StartUpgradeDialog({
  isOpen,
  onOpenChange,
  building,
  onStartUpgrade,
}: StartUpgradeDialogProps) {
  const form = useForm<UpgradeFormValues>({
    resolver: zodResolver(UpgradeFormSchema),
    defaultValues: {
        days: 0,
        hours: 0,
        minutes: 0,
    }
  });

  const onSubmit = (data: UpgradeFormValues) => {
    onStartUpgrade(building.id, data.days, data.hours, data.minutes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Upgrade: {building.name}</DialogTitle>
          <DialogDescription>
            Enter the time required to upgrade this building to level {building.level + 1}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             {form.formState.errors.days && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.days.message}</p>
            )}

            <DialogFooter>
              <Button type="submit">Start Upgrade</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
