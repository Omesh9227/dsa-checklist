const pool = require("../config/db");

// Create Table
exports.createTable = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await pool.query(
            "INSERT INTO tables(name) VALUES($1) RETURNING *",
            [name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get Tables + Tasks
exports.getTables = async (req, res) => {
    try {
        console.log("Fetching tables...");

        const tables = await pool.query("SELECT * FROM tables");

        for (let table of tables.rows) {
            const tasks = await pool.query(
                "SELECT * FROM tasks WHERE table_id=$1",
                [table.id]
            );
            table.tasks = tasks.rows;
        }

        res.json(tables.rows);

    } catch (err) {
        console.error("GET TABLE ERROR ❌:", err); // FULL ERROR
        res.status(500).json({ error: err.message }); // show actual error
    }
};

// Add Task
exports.addTask = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { name, url } = req.body;

        const result = await pool.query(
            "INSERT INTO tasks(table_id, name, url) VALUES($1,$2,$3) RETURNING *",
            [tableId, name, url]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, url, completed } = req.body;

        const result = await pool.query(
            "UPDATE tasks SET name=$1, url=$2, completed=$3 WHERE id=$4 RETURNING *",
            [name, url, completed, taskId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        await pool.query("DELETE FROM tasks WHERE id=$1", [taskId]);

        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};