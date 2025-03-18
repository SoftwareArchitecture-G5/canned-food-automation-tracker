"use client";

interface Automation {
    automation_id: string;
    name: string;
}

interface Props {
    automations: Automation[];
}

export default function AutomationPanel({ automations }: Props) {
    return (
        <div className="p-4 border-r w-40">
            <h3 className="font-bold mb-2">Automation</h3>
            {automations.map((item) => (
                <div
                    key={item.automation_id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("automation", JSON.stringify(item))}
                    className="p-2 border mb-2 bg-white cursor-pointer"
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}
