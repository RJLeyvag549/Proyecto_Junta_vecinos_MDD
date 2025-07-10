"use strict";

import { EntitySchema } from "typeorm";

const TransactionEntity = new EntitySchema({
    name: "Transaction",
    tableName: "transactions",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        amount: {
            type: Number,
            nullable: false,
        },
        description: {
            type: String,
            nullable: false,
        },
        state:{
            type: String,
            default: "pending",
            enum: ["pending", "completed", "rejected"],
            nullable: false,
        },
        date: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            nullable: false,
        },
    },
    indices: [
        {
            name: "IDX_TRANSACTION",
            columns: ["id"],
            unique: true,
        },
    ],
});

export default TransactionEntity;