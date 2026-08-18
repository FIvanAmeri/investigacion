import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("contenido_pagina")
export class ContenidoPagina {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 20,
  })
  tipo!: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  titulo!: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  slug!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  contenido!: string | null;

  @Column({
    type: "jsonb",
    nullable: true,
    default: () => "'{}'",
  })
  configuracion!: Record<string, unknown> | null;

  @Column({
    type: "integer",
  })
  orden!: number;

  @Column({
    type: "boolean",
    default: true,
  })
  activo!: boolean;

  @Column({
    name: "padre_id",
    type: "integer",
    nullable: true,
  })
  padreId!: number | null;

  @ManyToOne(
    () => ContenidoPagina,
    (contenido) => contenido.hijos,
    {
      nullable: true,
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({
    name: "padre_id",
  })
  padre!: ContenidoPagina | null;

  @OneToMany(
    () => ContenidoPagina,
    (contenido) => contenido.padre,
  )
  hijos!: ContenidoPagina[];

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt!: Date;
}