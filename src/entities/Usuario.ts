import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum EstadoUsuario {
  PENDIENTE = "PENDIENTE",
  APROBADO = "APROBADO",
  DENEGADO = "DENEGADO",
}

export enum RolUsuario {
  INVESTIGADOR = "INVESTIGADOR",
  COLABORADOR = "COLABORADOR",
  SUPERADMIN = "SUPERADMIN",
}

@Entity({ name: "usuarios" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  apellido!: string;

  @Column({ length: 150 })
  localidad!: string;

  @Column({ name: "centro_medico", length: 200 })
  centroMedico!: string;

  @Column({ length: 150 })
  especialidad!: string;

  @Column({ unique: true, length: 255 })
  correo!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: "enum",
    enum: EstadoUsuario,
    default: EstadoUsuario.PENDIENTE,
  })
  estado!: EstadoUsuario;

  @Column({
    type: "enum",
    enum: RolUsuario,
    default: RolUsuario.INVESTIGADOR,
  })
  rol!: RolUsuario;

  @Column({ name: "correo_verificado", default: false })
  correoVerificado!: boolean;

  @Column({ name: "es_super_admin", default: false })
  esSuperAdmin!: boolean;

  @Column({ name: "token_verificacion", type: "text", nullable: true })
  tokenVerificacion!: string | null;

  @Column({ name: "token_recuperacion", type: "text", nullable: true })
  tokenRecuperacion!: string | null;

  @Column({
    name: "token_recuperacion_expira",
    type: "timestamp",
    nullable: true,
  })
  tokenRecuperacionExpira!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}