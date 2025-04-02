import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const NotAllowToPage = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 text-center bg-white shadow-lg rounded-2xl">
                <CardContent className="flex flex-col items-center space-y-4">
                    <AlertTriangle className="text-red-500" size={48} />
                    <h2 className="text-xl font-semibold">Access Denied</h2>
                    <p className="text-gray-600">
                        Your authority does not allow you to access this page.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotAllowToPage;
