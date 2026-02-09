<<<<<<< HEAD
import React, { useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect } from "react";
=======
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
<<<<<<< HEAD
=======

>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [userBalance, setUserBalance] = useState(0);
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

<<<<<<< HEAD
  // Get All expesen Details
  const fetchExpenseDetails = async () => {
    // Implementation goes here
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. please try again.", error);
=======
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
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Handle Add Expense
  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
=======
  // Handle Add Expense with proper balance validation
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    const expenseAmount = Number(amount);

    // Frontend validation
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

<<<<<<< HEAD
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
=======
    if (isNaN(expenseAmount)) {
      toast.error("Amount must be a valid number");
      return;
    }

    if (expenseAmount <= 0) {
      toast.error("Amount must be greater than 0");
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }
<<<<<<< HEAD
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting Expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle download income details
  const handleDownloadExpenseDetails = async () => {
    // Implementation goes here
    try{
        const response = await axiosInstance.get(
            API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
            {
                responseType: "blob",
                // params: { id }  // Include the ID in the request
            }
        );
   // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "expense_details.xlsx");
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Show success message
        toast.success("Expense downloaded successfully!");
        
    } catch (error) {
        console.error("Error downloading expense details:", error);
        toast.error("Failed to download expense details. Please try again");
    }
};


  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
=======

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
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
<<<<<<< HEAD
=======
              currentBalance={userBalance}
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
<<<<<<< HEAD
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
=======
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
<<<<<<< HEAD
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
=======
          <AddExpenseForm 
            onAddExpense={handleAddExpense}
            currentBalance={userBalance}
          />
        </Modal>

>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
<<<<<<< HEAD
            content="Are you sure you want to delete this expense detail?"
=======
            content="Are you sure you want to delete this expense?"
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

<<<<<<< HEAD
export default Expense;
=======
export default Expense;
>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875
