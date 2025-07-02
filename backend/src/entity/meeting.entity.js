"use strict";

import { EntitySchema } from "typeorm";

export const MeetingEntity = new EntitySchema({
  name: "Meeting",
  tableName: "meetings",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    lugar: {
      type: String,
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    hora: {
      type: "time",
      nullable: false,
    },
    modalidad: {
      type: String,
      default: "Presencial",
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: () => "CURRENT_TIMESTAMP",
    }
  },
  relations: {
    asistencias: {
      target: "Attendance",
      type: "one-to-many",
      inverseSide: "reunion"
    }
  }
});

export default MeetingEntity;
