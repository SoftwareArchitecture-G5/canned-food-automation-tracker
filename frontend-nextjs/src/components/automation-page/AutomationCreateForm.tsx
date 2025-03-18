"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {Automation} from "@/type/automation";

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
});

export function CreateAutomationForm({ onAutomationCreated }: { onAutomationCreated: (automation: Automation) => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to create automation");
            }

            const newAutomation = await response.json();

            onAutomationCreated(newAutomation);

            toast({
                title: "Automation created",
                description: `${values.name} has been successfully created.`,
            });

            form.reset();
        } catch (error) {
            console.error("Error creating automation:", error);
            toast({
                title: "Error",
                description: "Failed to create automation. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Create New Automation</CardTitle>
                <CardDescription>Add a new automation to your system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter automation name" {...field} />
                                    </FormControl>
                                    <FormDescription>This is the name of your automation.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe what this automation does" className="resize-none" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a brief description of the automation's purpose and functionality.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Automation"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
