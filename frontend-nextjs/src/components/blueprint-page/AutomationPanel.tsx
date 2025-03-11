export default function AutomationPanel() {
    const automationItems = [
        { id: "robot-arm", label: "Robot Arm" },
        { id: "conveyor", label: "Conveyor Belt" },
        { id: "sensor", label: "Sensor" },
    ];

    return (
        <div className="p-4 border-r w-40">
            <h3 className="font-bold mb-2">Automation</h3>
            {automationItems.map((item) => (
                <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("automationType", item.label)}
                    className="p-2 border mb-2 bg-white cursor-pointer"
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
}
