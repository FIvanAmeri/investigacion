import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/Usuario";
import { Sistema } from "@/entities/Sistema";
import { UsuarioSistema } from "@/entities/UsuarioSistema";

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
  entities: [User, Sistema, UsuarioSistema],
  synchronize: false,
  logging: false,
};

export async function getDatabase(): Promise<DataSource> {
  if (globalThis.appDataSource?.isInitialized) {
    return globalThis.appDataSource;
  }

  const dataSource =
    globalThis.appDataSource ??
    new DataSource(dataSourceOptions);

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  globalThis.appDataSource = dataSource;

  return dataSource;
}