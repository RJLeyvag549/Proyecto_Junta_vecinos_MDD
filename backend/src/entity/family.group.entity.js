//* Esta entidad es para representar a miembros de grupos familiares asociados a un usuario vecino.
//* La separé de la entidad user.entity.js porque no todos los usuarios tienen un grupo familiar asociado.

//* Almacena solo nombre completo y rut (heredan los demás datos del usuario principal).

//* N:1 entre FamilyGroupEntity y UserEntity

"use strict";

import { EntitySchema } from "typeorm";

//Hay que importar la entidad UserEntity para poder referenciarla en la columna mainUserId
import User from "../entity/user.entity.js";

export const FamilyGroupEntity = new EntitySchema({
    name: "FamilyGroup",
    tableName: "family_groups",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        firstName: {
            type: String,
            nullable: false,
        },
        lastName: {
            type: String,
            nullable: false,
        },
        rut: {
            type: String,
            unique: true,
            nullable: false,
        },
    },
    
    //* Relación con la entidad UserEntity
    //* Cómo funciona: Guarda en la tabla family_groups una columna llamada mainUserId que referencia al User.id
    relations: {
        mainUser: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            onDelete: "CASCADE", 
            nullable: false,
        }
    },
});

//* mainUser => Nombre de la relación (que sea descriptivo). Aquí mainUser representa al usuario principal que está asociado al grupo familiar
//* target => Entidad a la que se relaciona (se pone el name de la entidad)
//* joinColumn: true => joinColumn sirve para decirle explícitamente a TypeORM cómo se llamará la columna de la clave foránea (foreign key) en la tabla actual.
//* joinColumn: { name: "mainUserId" } => Crea una columna llamada mainUserId en la tabla family_groups, que será una foreign key que apunta a la tabla users
//* joinColumn: true => crea el nombre de la columna, basándose en el nombre de la relación y el nombre de la clave primaria de la entidad relacionada. Eso va a crear una columna llamada userId (porque el nombre de la relación es user, y el ID de User se llama id).
//* onDelete: "CASCADE" => Si se elimina el usuario principal, se eliminan los grupos familiares asociados

export default FamilyGroupEntity;