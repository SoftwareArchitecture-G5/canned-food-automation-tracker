import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity()
export class Blueprint {
    @PrimaryGeneratedColumn('uuid')
    blueprint_id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'jsonb' })
    nodes: any[];

    @Column({ type: 'jsonb' })
    edges: any[];

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;
}
