import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/Usuario";
import { Sistema } from "@/entities/Sistema";
import { UsuarioSistema } from "@/entities/UsuarioSistema";
import { ContenidoPagina } from "@/entities/ContenidoPagina";

declare global {
  var appDataSource: DataSource | undefined;
}

function obtenerVariable(nombre: string): string {
  const valor = process.env[nombre];

  if (!valor) {
    throw new Error(
      `La variable de entorno ${nombre} no está configurada.`,
    );
  }

  return valor;
}

const dataSourceOptions = {
  type: "postgres" as const,
  host: obtenerVariable("DB_HOST"),
  port: Number(obtenerVariable("DB_PORT")),
  username: obtenerVariable("DB_USERNAME"),
  password: obtenerVariable("DB_PASSWORD"),
  database: obtenerVariable("DB_NAME"),
  entities: [User, Sistema, UsuarioSistema, ContenidoPagina],
  synchronize: false,
  logging: false,
};

export async function getDatabase(): Promise<DataSource> {
  const entidades = [
    User,
    Sistema,
    UsuarioSistema,
    ContenidoPagina,
  ];

  const dataSource =
    globalThis.appDataSource ??
    new DataSource({
      ...dataSourceOptions,
      entities: entidades,
    });

  if (dataSource.isInitialized) {
    if (dataSource.hasMetadata(User)) {
      return dataSource;
    }

    await dataSource.destroy();
  }

  const nuevaDataSource = new DataSource({
    ...dataSourceOptions,
    entities: entidades,
  });

  await nuevaDataSource.initialize();

  globalThis.appDataSource = nuevaDataSource;

  return nuevaDataSource;
}