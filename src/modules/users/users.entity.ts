import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from '../classes/entities/classes.entity';

@Entity('users')
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
    type: 'enum',
    enum: ['student', 'coordinator', 'admin'],
    default: 'student',
    nullable: false,
  })
  role: 'student' | 'coordinator' | 'admin';

  @Column({
    type: 'varchar',
    nullable: true,
  })
  fcm_token: string;

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

  @ManyToOne(() => Class, (classEntity) => classEntity.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
