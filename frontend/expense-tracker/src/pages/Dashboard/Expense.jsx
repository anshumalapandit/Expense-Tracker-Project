import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // Fetch both expenses and user balance
  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const [expensesRes, dashboardRes] = await Promise.all([
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
        axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA)
      ]);
      
      setExpenseData(expensesRes.data);
      setUserBalance(dashboardRes.data.totalBalance);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense with proper balance validation
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    const expenseAmount = Number(amount);

    // Frontend validation
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (isNaN(expenseAmount)) {
      toast.error("Amount must be a valid number");
      return;
    }

    if (expenseAmount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    // Frontend balance check
    if (expenseAmount > userBalance) {
      toast.error(`Insufficient balance! You need $${expenseAmount - userBalance} more `);
      return;
    }

    try {
      // Backend submission
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount: expenseAmount,
        date,
        icon,
      });

      // Update local balance
      setUserBalance(prev => prev - expenseAmount);
      
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error adding expense:", error);
      const errorMsg = error.response?.data?.message || "Failed to add expense";
      
      // Special handling for balance errors from backend
      if (errorMsg.toLowerCase().includes("balance")) {
        toast.error(`Server blocked: ${errorMsg}`);
      } else {
        toast.error(errorMsg);
      }
    }
  };

  // Delete Expense with balance update
  const deleteExpense = async (id) => {
    try {
      // First get the expense to know the amount
      const expenseToDelete = expenseData.find(e => e._id === id);
      if (!expenseToDelete) return;

      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      // Update local balance
      setUserBalance(prev => prev + expenseToDelete.amount);
      
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  // Handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Expense downloaded successfully!");
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              currentBalance={userBalance}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm 
            onAddExpense={handleAddExpense}
            currentBalance={userBalance}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;