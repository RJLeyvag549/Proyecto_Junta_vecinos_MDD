import { DataSource } from "typeorm"
import { DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js"
import UserEntity from "../entity/user.entity.js"
import { publicacionesEntity } from "../entity/publicaciones.entity.js"
import { ComentariosEntity } from "../entity/comentarios.entity.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: HOST,
    port: 5432,
    username: DB_USERNAME,
    password: PASSWORD,
    database: DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        UserEntity,
        publicacionesEntity,
        ComentariosEntity
    ]
});

    export async function connectDB() {
     try {
      await AppDataSource.initialize();
    console.log("=> Conexión con la base de datos exitosa!");
      } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
