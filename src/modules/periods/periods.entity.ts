import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Class } from '../classes/entities/classes.entity';

@Entity('periods')
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  year: number;

  @Column({ type: 'enum', enum: ['1', '2'], nullable: false })
  semester: '1' | '2';

  @Column({ nullable: false })
  period_number: number;

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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  updated_at: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  is_active: boolean;

  @OneToMany(() => Class, (classEntity) => classEntity.period)
  @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
  classes: Class[];
}
