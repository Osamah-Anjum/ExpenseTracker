import { useState, useEffect } from "react";
import api from "../axios";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    title: "",
    date: "",
  });
  const categories = ["Food", "Transport", "Shopping", "Bills", "Others"];

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(
        "Error fetching expenses:",
        err.response?.data || err.message
      );
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/expenses", form);
      }
      setForm({ amount: "", category: "", title: "", date: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Error saving expense:", err.response?.data || err.message);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      amount: expense.amount,
      category: expense.category,
      title: expense.title,
      date: expense.date.split("T")[0],
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(
        "Error deleting expense:",
        err.response?.data || err.message
      );
    }
  };

  // 📊 Summary
  const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const thisMonth = expenses
    .filter((exp) => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-2xl font-bold text-blue-600">₹{total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">This Month</h3>
          <p className="text-2xl font-bold text-green-600">₹{thisMonth}</p>
        </div>
      </div>

      {/* Add / Edit Form (same as before) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Expense" : "Add Expense"}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          >
            <option value="">-- Select Category --</option>
            {categories.map((ex, idx) => (
              <option key={idx} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name="title"
          placeholder="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ amount: "", category: "", title: "", date: "" });
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/* ✅ Expenses Table */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-3">Your Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td className="p-2 border">₹{exp.amount}</td>
                  <td className="p-2 border">{exp.category}</td>
                  <td className="p-2 border">{exp.title}</td>
                  <td className="p-2 border">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
