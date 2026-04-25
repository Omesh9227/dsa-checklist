import React, { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [tables, setTables] = useState([]);
  const [tableName, setTableName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskURL, setTaskURL] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const [editTaskId, setEditTaskId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editURL, setEditURL] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await API.get("/table");
      setTables(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    }
  };

  // ================= CREATE TABLE =================
  const createTable = async () => {
    if (!tableName.trim()) {
      return toast.error("Enter table name");
    }

    try {
      await API.post("/table", { name: tableName });

      toast.success("Table created 🎉");

      setTableName("");
      fetchTables();

    } catch (err) {
      toast.error(err.response?.data?.error || "Error creating table");
    }
  };

  // ================= ADD TASK =================
  const addTask = async () => {
    if (!taskName.trim() || !selectedTable) {
      return toast.error("Fill all fields");
    }

    const table = tables.find((t) => t.id === Number(selectedTable));

    if (table?.tasks.some((task) => task.name.toLowerCase() === taskName.toLowerCase())) {
      return toast.error("Task already exists");
    }

    try {
      await API.post(`/table/${selectedTable}/task`, {
        name: taskName,
        url: taskURL,
      });

      toast.success("Task added ✅");

      setTaskName("");
      setTaskURL("");
      setSelectedTable("");

      fetchTables();

    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding task");
    }
  };

  // ================= TOGGLE =================
  const toggleTask = async (task) => {
    try {
      await API.put(`/task/${task.id}`, {
        name: task.name,
        url: task.url,
        completed: !task.completed,
      });

      fetchTables();
    } catch {
      toast.error("Update failed");
    }
  };

  // ================= DELETE =================
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/task/${id}`);
      toast.success("Deleted 🗑️");
      fetchTables();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= EDIT =================
  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditName(task.name);
    setEditURL(task.url);
  };

  const updateTask = async () => {
    if (!editName.trim()) {
      return toast.error("Task name required");
    }

    try {
      await API.put(`/task/${editTaskId}`, {
        name: editName,
        url: editURL,
        completed: false,
      });

      toast.success("Updated ✏️");

      setEditTaskId(null);
      fetchTables();

    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="container mt-5">
      {/* 🔥 TOASTER */}
      <Toaster position="top-right" />

      <h2 className="text-center mb-5">🚀 DSA Tracker</h2>

      {/* TOP SECTION */}
      <div className="row mb-5">

        {/* Create Table */}
        <div className="col-md-6">
          <div className="card-custom">
            <h5 className="mb-3">Create Table</h5>
            <input
              className="form-control mb-3"
              placeholder="Enter table name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={createTable}>
              Create Table
            </button>
          </div>
        </div>

        {/* Add Task */}
        <div className="col-md-6">
          <div className="card-custom">
            <h5 className="mb-3">Add Task</h5>

            <select
              className="form-control mb-2"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="">Select Table</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              className="form-control mb-2"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <input
              className="form-control mb-3"
              placeholder="URL"
              value={taskURL}
              onChange={(e) => setTaskURL(e.target.value)}
            />

            <button className="btn btn-success w-100" onClick={addTask}>
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* TABLES */}
      {tables.map((table) => (
        <div key={table.id} className="card-custom mb-4">
          <h4 className="mb-3">{table.name}</h4>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Task</th>
                <th>Status</th>
                <th>URL</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {table.tasks.map((task, i) => (
                <tr key={task.id}>
                  <td>{i + 1}</td>

                  <td>
                    {editTaskId === task.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="form-control"
                      />
                    ) : (
                      task.name
                    )}
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />
                  </td>

                  <td>
                    {editTaskId === task.id ? (
                      <input
                        value={editURL}
                        onChange={(e) => setEditURL(e.target.value)}
                        className="form-control"
                      />
                    ) : (
                      task.url && (
                        <a href={task.url} target="_blank" rel="noreferrer">
                          🔗
                        </a>
                      )
                    )}
                  </td>

                  <td>
                    {editTaskId === task.id ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={updateTask}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => startEdit(task)}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTask(task.id)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;