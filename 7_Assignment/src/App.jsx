import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("expenses")) || [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  function addExpense(e) {
    e.preventDefault();

    if (!name.trim() || Number(amount) <= 0 || !date) {
      alert("Please enter valid expense details.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: name.trim(),
      category,
      amount: Number(amount),
      date
    };

    setExpenses([newExpense, ...expenses]);

    setName("");
    setCategory("Food");
    setAmount("");
    setDate("");
  }

  function deleteExpense(id) {
    if (window.confirm("Delete this expense?")) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">₹</div>
        <h1>Expense Tracker</h1>
        <p>Keep track of your daily spending</p>
      </header>

      <div className="summary">
        <div className="summary-card">
          <p>Total Spending</p>
          <h2>₹{total.toFixed(2)}</h2>
        </div>

        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>{expenses.length}</h2>
        </div>
      </div>

      <section className="card">
        <h2>Add New Expense</h2>

        <form onSubmit={addExpense}>
          <div className="form-grid">
            <div className="field">
              <label>Expense Name</label>
              <input
                type="text"
                placeholder="e.g. Lunch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Education</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="add-button" type="submit">
            + Add Expense
          </button>
        </form>
      </section>

      <section className="card">
        <div className="table-heading">
          <h2>Expense History</h2>
          <span>{expenses.length} records</span>
        </div>

        {expenses.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">₹</div>
            <p>No expenses added yet.</p>
            <span>Add your first expense using the form above.</span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="expense-name">{expense.name}</td>
                    <td>
                      <span className="category">
                        {expense.category}
                      </span>
                    </td>
                    <td className="amount">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td>{expense.date}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>Personal Expense Tracker · React Practical</footer>
    </div>
  );
}

export default App;