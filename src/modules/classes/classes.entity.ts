import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Period } from '../periods/periods.entity';
import { User } from '../users/users.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Period, (period) => period.classes)
  period: Period;

  @Column({ type: 'int', default: 1 })
  class_number: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;

  @ManyToOne(() => User, (user) => user.class, {
    onDelete: 'SET NULL',
  })
  users: User[];
}
