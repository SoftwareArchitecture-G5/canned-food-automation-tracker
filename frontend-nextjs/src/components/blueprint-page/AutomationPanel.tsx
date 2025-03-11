import { useDraggable } from "@dnd-kit/core";

const automationItems = [
    { id: "robot-arm", label: "Robot Arm" },
    { id: "conveyor", label: "Conveyor Belt" },
    { id: "sensor", label: "Sensor" },
];

export default function AutomationPanel() {
    return (
        <div className="p-4 border-r w-40">
            <h3 className="font-bold mb-2">Automation</h3>
            {automationItems.map((item) => (
                <DraggableItem key={item.id} id={item.id} label={item.label} />
            ))}
        </div>
    );
}

function DraggableItem({ id, label }:{ id:string , label: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="p-2 border mb-2 bg-white cursor-pointer"
            style={{
                transform: transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                    : undefined,
            }}
        >
            {label}
        </div>
    );
}
