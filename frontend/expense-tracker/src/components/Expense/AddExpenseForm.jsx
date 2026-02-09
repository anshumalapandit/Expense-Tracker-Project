import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
<<<<<<< HEAD

const AddExpenseForm = ({ onAddExpense }) => {
=======
import { toast } from 'react-hot-toast'; // Install with: npm install react-hot-toast

const AddExpenseForm = ({ onAddExpense, currentBalance }) => {
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
    const [income, setIncome] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => {
        setIncome({ ...income, [key]: value });
    };

<<<<<<< HEAD
=======
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

>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
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
<<<<<<< HEAD
=======
                min="0"
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
            />
            
            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />
<<<<<<< HEAD
            <div className="flex justify-end mt-6">
            <button 
            type="button"
                onClick={() => onAddExpense(income)}
                className="add-btn add-btn-fill"
            >
                Add Expense
            </button>
        </div>
=======
            
            <div className="flex justify-end mt-6">
                <button 
                    type="button"
                    onClick={handleSubmit}
                    className="add-btn add-btn-fill"
                >
                    Add Expense
                </button>
            </div>
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
        </div>
    );
};

export default AddExpenseForm;