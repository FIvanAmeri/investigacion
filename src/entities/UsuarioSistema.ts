import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "@/entities/Usuario";
import { Sistema } from "@/entities/Sistema";

@Entity({ name: "usuarios_sistemas" })
export class UsuarioSistema {
  @PrimaryColumn({ name: "usuario_id" })
  usuarioId!: number;

  @PrimaryColumn({ name: "sistema_id" })
  sistemaId!: number;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "usuario_id" })
  usuario!: User;

  @ManyToOne(() => Sistema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "sistema_id" })
  sistema!: Sistema;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}