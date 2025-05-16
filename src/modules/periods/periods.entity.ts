import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Class } from '../classes/entities/classes.entity';

@Entity('periods')
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  year: number;

  @Column({
    type: 'enum',
    enum: ['1', '2'],
    nullable: false,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  semester: '1' | '2';

  @Column({ nullable: false })
  period_number: number;

  @Column({ type: 'boolean', default: true, nullable: false })
  is_active: boolean;

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

  @OneToMany(() => Class, (classEntity) => classEntity.period)
  classes: Class[];
}
