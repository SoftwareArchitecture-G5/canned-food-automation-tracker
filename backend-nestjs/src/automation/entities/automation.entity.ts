import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Maintenance} from "../../maintenance/entities/maintenance.entity";

export enum AutomationStatus {
    ACTIVE = 'active',
    INACTIVATE = 'inactive',
    PENDING = 'pending',
}

@Entity('automation')
export class Automation {
    @PrimaryGeneratedColumn('uuid')
    automation_id: string;

    @Column({type: 'varchar', length: 50})
    name: string;

    @Column({type: 'varchar', length: 100, nullable: true})
    description: string;

    @Column({type: 'enum', enum: AutomationStatus, default: AutomationStatus.ACTIVE})
    status: string;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date;

    @OneToMany(()=>Maintenance, (maintenance) => maintenance.automation)
    maintenances: Maintenance[];
}
