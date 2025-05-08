import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Class } from './classes.entity';

@Entity('class_tokens')
export class ClassToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        unique: true,
        type: 'varchar',
    })
    token: string;

    @Column({
        type: 'timestamp',
        nullable: false,
        transformer: {
            from: (value: string) => value,
            to: (value: string) => value,
        },
    })
    expiration_date: string;

    @Column({
        type: 'int',
        default: 1,
        nullable: false
    })
    token_number: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
        transformer: {
            from: (value: string) => value,
            to: (value: string) => value,
        },
    })
    created_at: string;

    @ManyToOne(() => Class, (classEntity) => classEntity.classTokens)
    @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
    class: Class;
}
