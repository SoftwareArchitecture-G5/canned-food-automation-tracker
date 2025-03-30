import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Automation} from "../../automation/entities/automation.entity";
export enum MaintenanceStatus {
    PENDING = "pending",
    COMPLETED = "completed",
}

@Entity("maintenance")
export class Maintenance {
    @PrimaryGeneratedColumn('uuid')
    maintenance_id: string;

    @ManyToOne(() => Automation, (automation) => automation.maintenances, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'automation_id' })
    automation: Automation;

    @Column({type: 'varchar', nullable: true, length: 100})
    issue_report: string;

    @Column({type: 'date', nullable: true,})
    date: Date;

    @Column({type:"enum", enum: MaintenanceStatus, default: MaintenanceStatus.PENDING})
    status:MaintenanceStatus;
}
