import { useState, useEffect } from "react";
import api from "../axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

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

  // 📊 Summary
  const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const thisMonth = expenses
    .filter((exp) => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((acc, exp) => acc + exp.amount, 0);

  // 📊 Pie Chart Data
  const categoryData = Object.values(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || {
        category: exp.category,
        amount: 0,
      };
      acc[exp.category].amount += exp.amount;
      return acc;
    }, {})
  );

  const categories = ["Food", "Transport", "Shopping", "Bills", "Others"];

  // Bar Chart Data
  const chartData = categories.map((cat) => {
    const total = expenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return { category: cat, amount: total };
  });

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA336A"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

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

      {/* ✅ Pie Chart */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-3">Spending by Category</h3>
        {categoryData.length === 0 ? (
          <p>No data to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Bar Chart for Trend Analysis */}
      <div className="bg-white p-4 rounded shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-3">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
