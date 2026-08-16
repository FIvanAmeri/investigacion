import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "sistemas" })
export class Sistema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ unique: true, length: 100 })
  slug!: string;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ type: "text", nullable: true })
  url!: string | null;

  @Column({ default: true })
  activo!: boolean;

  @Column({ default: 0 })
  orden!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}