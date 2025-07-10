"use strict";
import Transaction from "../entity/transaction.entity.js";
import { createTransactionValidation, updateTransactionValidation, transactionIdParamValidation } from "../validations/transaction.validation.js";
import { AppDataSource } from "../config/configDb.js";

export async function createTransaction(req, res) {
    try {      
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const { amount, description } = req.body;
        const userId = req.user.id;

        //if (!amount || !description) {
        //    return res.status(400).json({ message: "amount y description son requeridos." });
        //}
        const { error } = createTransactionValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }         
        const newTransaction = transactionRepository.create({
            amount,
            description,
            user: { id: userId }
        });
        await transactionRepository.save(newTransaction);
        res.status(201).json({ message: "Transaccion creada exitosamente.", data: newTransaction });
        
    } catch (error) {
        console.error("Error en crear la transaccion.", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

export async function getTransactions(req, res) {
    try {
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const transactions = await transactionRepository.find({relations: ["user"]});
        const result = transactions.map(t=> ({
            id: t.id,
            username: t.user?.username,
            amount: t.amount,
            description: t.description,
            state: t.state,
            date: t.date
        }));
        res.status(200).json({ message: "Transacciones obtenidas exitosamente.", data: result });
        
    } catch (error) {
        console.error("Error en obtener las transacciones.", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

export async function updateTransaction(req, res) {
    try {
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const { id } = req.params;
        const { amount, description, state } = req.body;
        const transaction = await transactionRepository.findOne({ where: { id }, relations: ["user"] });

        if (!transaction) {
            return res.status(404).json({ message: "Transaccion no encontrada." });
        }
        const { error: bodyError } = updateTransactionValidation.validate(req.body);
        if (bodyError) {
            return res.status(400).json({ message: bodyError.message });
        }
        const { error: paramError } = transactionIdParamValidation.validate(req.params);
        if (paramError) {
            return res.status(400).json({ message: paramError.message });
        }
        transaction.amount = amount || transaction.amount;
        transaction.description = description || transaction.description;
        transaction.state = state || transaction.state;

        await transactionRepository.save(transaction);

        const result = {
            id: transaction.id,
            username: transaction.user?.username,
            amount: transaction.amount,
            description: transaction.description,
            state: transaction.state,
            date: transaction.date
        };
        res.status(200).json({ message: "Transaccion actualizada exitosamente.", data: result });
        
    } catch (error) {
        console.error("Error en modificar la transaccion.", error);
        res.status(500).json({ message: "Error interno del servidor." });
        
    }
}

export async function deleteTransaction(req, res) {
    try {             
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const { id } = req.params;

        const transaction = await transactionRepository.findOne({ where: { id } });

        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada." });
        }
        const { error } = transactionIdParamValidation.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.message });
        }           
        await transactionRepository.remove(transaction);
        res.status(200).json({ message: "Transacción eliminada exitosamente." });

    } catch (error) {
        console.error("Error en eliminar la transaccion.", error);
        res.status(500).json({ message: "Error interno del servidor." });
        
    }
}


