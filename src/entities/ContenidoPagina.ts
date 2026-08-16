import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum TipoContenidoPagina {
  MENU = "MENU",
  SUBMENU = "SUBMENU",
  SECCION = "SECCION",
}

@Entity({ name: "contenido_pagina" })
export class ContenidoPagina {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: TipoContenidoPagina,
  })
  tipo!: TipoContenidoPagina;

  @Column({ length: 150 })
  titulo!: string;

  @Column({ length: 150 })
  slug!: string;

  @Column({ type: "text", nullable: true })
  contenido!: string | null;

  @Column({ type: "jsonb", nullable: true })
  configuracion!: Record<string, unknown> | null;

  @Column({ default: 0 })
  orden!: number;

  @Column({ default: true })
  activo!: boolean;

  @Column({ name: "padre_id", nullable: true })
  padreId!: number | null;

  @ManyToOne(
    () => ContenidoPagina,
    (contenido) => contenido.hijos,
    {
      nullable: true,
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "padre_id" })
  padre!: ContenidoPagina | null;

  @ManyToOne(
    () => ContenidoPagina,
    (contenido) => contenido.padre,
  )
  hijos!: ContenidoPagina[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}