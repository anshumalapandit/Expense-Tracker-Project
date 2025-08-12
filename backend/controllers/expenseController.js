const xlsx=require('xlsx')
const Expense=require("../models/Expense")
// Add Expense Source
// exports.addExpense = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const { icon, category, amount, date } = req.body;

//         // Validation: Check for missing fields
//         if (!category || !amount || !date) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const newExpense = new Expense({
//             userId,
//             icon,
//             category,
//             amount,
//             date: new Date(date)
//         });

//         await newExpense.save();
//         res.status(200).json(newExpense);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };
// const Expense = require("../models/Expense");
const User = require("../models/User");
const mongoose = require('mongoose');

exports.addExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { icon, category, amount, date } = req.body;
        const userId = req.user.id;

        // Validation
        if (!category || !amount || !date) {
            await session.abortTransaction();
            return res.status(400).json({ message: "All fields are required" });
        }

        const amountNum = Number(amount);
        if (isNaN(amountNum)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid amount" });
        }

        // 1. Check balance atomically
        const user = await User.findOne({ _id: userId }).session(session);
        
        if (user.balance < amountNum) {
            await session.abortTransaction();
            return res.status(400).json({ 
                message: `Insufficient balance! Need $${amountNum - user.balance} more`
            });
        }

        // 2. Deduct balance
        await User.updateOne(
            { _id: userId },
            { $inc: { balance: -amountNum } },
            { session }
        );

        // 3. Create expense
        const newExpense = await Expense.create([{
            userId,
            icon,
            category,
            amount: amountNum,
            date: new Date(date)
        }], { session });

        await session.commitTransaction();
        res.status(200).json(newExpense[0]);

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ 
            message: error.response?.data?.message || "Transaction failed" 
        });
    } finally {
        session.endSession();
    }
};

// ... (keep getAllExpense, deleteExpense, downloadExpenseExcel exactly as is)

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Delete Source
exports.deleteExpense= async (req, res) => {
   // const userId = req.user.id;

    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = expense.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "expense");
        
        const fileName = 'expense_details.xlsx';
        xlsx.writeFile(wb, fileName);
        res.download(fileName);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};