'use strict';

import { EntitySchema } from 'typeorm';

export const UserEntity = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    fullName: {
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
      default: 'pendiente',
      nullable: false,
    },
  },
  relations: {
    asistencias: {
      target: 'Attendance',
      type: 'one-to-many',
      inverseSide: 'usuario',
    },
  },
});

export default UserEntity;
