import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { toast } from 'react-hot-toast'; // Install with: npm install react-hot-toast

const AddExpenseForm = ({ onAddExpense, currentBalance }) => {
    const [income, setIncome] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => {
        setIncome({ ...income, [key]: value });
    };

    const handleSubmit = () => {
        // 1. Convert amount to number
        const expenseAmount = Number(income.amount);
        
        // 2. Check if balance is insufficient (NEW)
        if (currentBalance !== undefined && expenseAmount > currentBalance) {
            toast.error(
                ` Insufficient Balance ! You need $${expenseAmount - currentBalance} more`,
                {
                    style: {
                        border: '1px solid #ff4444',
                        padding: '16px',
                        color: '#ff4444',
                        background: '#fff8f8'
                    },
                    icon: '⚠️'
                }
            );
            return; // Stop if balance is low
        }

        // ✅ Original logic remains UNCHANGED
        onAddExpense(income);
        
        // Optional: Clear only amount/category (keeps date/icon)
        setIncome(prev => ({
            ...prev,
            category: "",
            amount: ""
        }));
    };

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />
            
            <Input
                value={income.category}
                onChange={({ target }) => handleChange("category", target.value)}
                label="Category"
                placeholder="Rent, Groceries, etc."
                type="text"
            />
            
            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
                min="0"
            />
            
            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />
            
            <div className="flex justify-end mt-6">
                <button 
                    type="button"
                    onClick={handleSubmit}
                    className="add-btn add-btn-fill"
                >
                    Add Expense
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;