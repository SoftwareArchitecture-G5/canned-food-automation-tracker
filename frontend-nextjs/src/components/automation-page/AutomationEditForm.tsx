"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

import {Automation, AutomationStatus} from "@/type/automation";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Automation name must be at least 2 characters.",
    })
    .max(50, {
      message: "Automation name must not exceed 50 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(100, {
      message: "Description must not exceed 100 characters.",
    }),
  status: z.nativeEnum(AutomationStatus, {
    errorMap: () => ({ message: "Invalid status selected." }),
  }),
});

interface EditAutomationFormProps {
  automation: {
    automation_id: string;
    name: string;
    description: string;
    status: AutomationStatus;
  };
  onAutomationUpdated: (updatedAutomation: Automation) => void;
  onClose: () => void;
}

export function EditAutomationForm({
  automation,
  onAutomationUpdated,
  onClose,
}: EditAutomationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: automation.name,
      description: automation.description,
      status: automation.status,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations/${automation.automation_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update automation");
      }

      const updatedAutomation = await response.json();

      onAutomationUpdated(updatedAutomation);

      toast({
        title: "Automation updated",
        description: `Automation "${updatedAutomation.name}" has been successfully updated.`,
      });

      onClose();
    } catch (error) {
      console.error("Error updating automation:", error);
      toast({
        title: "Error",
        description: "Failed to update automation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Automation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter automation name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of your automation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this automation does"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the automation's purpose and
                    functionality.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AutomationStatus.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={AutomationStatus.INACTIVE}>
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Set the status of the automation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Automation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
