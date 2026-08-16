import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("tokens_verificacion")
export class TokenVerificacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  usuarioId!: number;

  @Column({ unique: true, length: 255 })
  token!: string;

  @Column()
  expiraEn!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}