"use strict";

import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
        },
    role: {
      type: String,
      default: "user",
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
    email: {
      type: String,
      unique: true,
      nullable: false,
        },
    password: {
      type: String,
      nullable: false,
        },
    contact: {
      type: String,
      nullable: false,
        },
    homeAddress: {
      type: String,
      nullable: false,
            },
    docIdentity: {
      type: String,
      nullable: false,
        },
    docResidence: {
      type: String,
      nullable: false,
        },
    requestStatus: {
      type: String,
      default: "pendiente",
      nullable: false,
        },
    },
    relations: {
      familyGroup: {
        type: "one-to-many",
        target: "FamilyGroup",
        inverseSide: "mainUser",
        //cascade: true, // Permite que las operaciones de inserción, actualización y eliminación se propaguen a los grupos familiares asociados
      },
    }
});

export default UserEntity;



