import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';
import { Class } from '../classes/classes.entity';
import { Period } from '../periods/periods.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['project', 'assignment', 'documentation', 'report'],
    default: 'project',
  })
  type: string;

  @Column({ type: 'date' })
  deadline: string;

  @Column({ type: 'enum', enum: ['pending', 'completed'], default: 'pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Class, (classEntity) => classEntity.id)
  class: Class;

  @ManyToOne(() => Period, (period) => period.id)
  period: Period;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}
