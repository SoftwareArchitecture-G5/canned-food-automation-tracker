"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

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
})

export function CreateAutomationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            console.log(values)
            toast({
                title: "Automation created",
                description: `${values.name} has been successfully created.`,
            })
            setIsSubmitting(false)
            form.reset()
        }, 1000)
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
    )
}

