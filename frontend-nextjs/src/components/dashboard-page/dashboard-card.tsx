import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface DashboardCardProps {
    title?: string;
    description?: string;
    variant?: BadgeVariant;
    icon?: React.ReactNode;
    value?: string;
}

export function DashboardCard({
    title,
    description,
}: DashboardCardProps) {
return (
    <Card>
    <CardHeader>
        <CardTitle>{title || "Title"}</CardTitle>
        <CardDescription>{description || "Description"}</CardDescription>
    </CardHeader>
    </Card>
);
}