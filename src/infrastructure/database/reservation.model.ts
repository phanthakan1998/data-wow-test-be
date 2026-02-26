import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'reservations' })
@Unique(['concertId', 'userId'])
export class ReservationEntityModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'concert_id' })
  concertId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ default: false })
  isCanceled: boolean;
}
