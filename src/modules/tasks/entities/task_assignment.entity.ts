import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './tasks.entity';
import { User } from 'src/modules/users/users.entity';

@Entity('task_assignments')
@Index('idx_ta_user_id', ['user'])
@Index('idx_ta_user_status', ['user', 'status'])
@Index('idx_ta_task_id', ['task'])
export class TaskAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['pending', 'canceled', 'completed', 'expired'],
    default: 'pending',
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  status: 'pending' | 'canceled' | 'completed' | 'expired';

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    default: () => 'now()',
  })
  updated_at: Date;

  @ManyToOne(() => Task, (task) => task.task_assignments, { eager: true })
  @JoinColumn({
    name: 'task_id',
    referencedColumnName: 'id',
  })
  task: Task;

  @ManyToOne(() => User, (user) => user.task_assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
