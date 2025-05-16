import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Period } from '../../periods/periods.entity';
import { User } from '../../users/users.entity';
import { ClassToken } from './class-token.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1, nullable: false })
  class_number: number;

  @Column({ type: 'varchar', nullable: true })
  teacher_name?: string;

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

  @Column({ type: 'boolean', default: true, nullable: false })
  is_active: boolean;

  @OneToMany(() => User, (user) => user.class)
  users: User[];

  @ManyToOne(() => Period, (period) => period.classes, { nullable: false })
  @JoinColumn({ name: 'period_id', referencedColumnName: 'id' })
  period: Period;

  @OneToMany(() => ClassToken, (classToken) => classToken.class)
  classTokens: ClassToken[];
}
