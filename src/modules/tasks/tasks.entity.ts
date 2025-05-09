import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Class } from '../classes/entities/classes.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['project', 'task', 'assessment', 'metting'],
    default: 'project',
    nullable: false,
  })
  type: 'project' | 'task' | 'assessment' | 'metting';

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  deadline: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'canceled', 'completed'],
    default: 'pending',
    nullable: false,
  })
  status: 'pending' | 'canceled' | 'completed';

  @Column({
    type: 'varchar',
    nullable: true,
  })
  link?: string;

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Class, (classEntity) => classEntity.id)
  @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
  class: Class;
}
