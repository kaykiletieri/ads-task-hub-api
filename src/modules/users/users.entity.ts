import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Class } from '../classes/entities/classes.entity';
import { TaskAssignment } from '../tasks/entities/task_assignment.entity';
import { Task } from '../tasks/entities/tasks.entity';

@Entity('users')
@Index('idx_user_class_id', ['class'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password_hash: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  fcm_token: string;

  @Column({
    type: 'enum',
    enum: ['student', 'coordinator', 'admin'],
    default: 'student',
    nullable: false,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  role: 'student' | 'coordinator' | 'admin';

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

  @ManyToOne(() => Class, (classEntity) => classEntity.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.user)
  task_assignments?: TaskAssignment[];

  @OneToMany(() => Task, (task) => task.created_by)
  created_tasks: Task[];

  @OneToMany(() => Task, (task) => task.updated_by)
  updated_tasks: Task[];
}
