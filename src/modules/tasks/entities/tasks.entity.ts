import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TaskAssignment } from './task_assignment.entity';
import { User } from 'src/modules/users/users.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  link?: string;

  @Column({
    type: 'enum',
    enum: ['project', 'task', 'assessment', 'metting'],
    default: 'project',
    nullable: false,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  type: 'project' | 'task' | 'assessment' | 'metting';

  @Column({
    type: 'enum',
    enum: ['pending', 'expired', 'canceled', 'available'],
    default: 'pending',
    nullable: false,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  availability_status: 'pending' | 'expired' | 'canceled' | 'available';

  @Column({
    type: 'timestamp',
    nullable: true,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  availability_at?: string;

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  deadline: string;

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

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.task)
  task_assignments?: TaskAssignment[];

  @ManyToOne(() => User, user => user.created_tasks, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}
