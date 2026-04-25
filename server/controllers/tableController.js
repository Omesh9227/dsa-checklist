const pool = require("../config/db");

// ================= CREATE TABLE =================
exports.createTable = async (req, res) => {
    try {
        let { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Table name is required" });
        }

        name = name.trim();

        // 🔥 Case-insensitive duplicate check
        const existing = await pool.query(
            "SELECT * FROM tables WHERE LOWER(name) = LOWER($1)",
            [name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Table already exists" });
        }

        const result = await pool.query(
            "INSERT INTO tables(name) VALUES($1) RETURNING *",
            [name]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("CREATE TABLE ERROR ❌:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ================= GET TABLES =================
exports.getTables = async (req, res) => {
    try {
        const tables = await pool.query("SELECT * FROM tables ORDER BY id");

        for (let table of tables.rows) {
            const tasks = await pool.query(
                "SELECT * FROM tasks WHERE table_id=$1 ORDER BY id",
                [table.id]
            );
            table.tasks = tasks.rows;
        }

        res.json(tables.rows);

    } catch (err) {
        console.error("GET TABLE ERROR ❌:", err);
        res.status(500).json({ error: err.message });
    }
};

// ================= ADD TASK =================
exports.addTask = async (req, res) => {
    try {
        const { tableId } = req.params;
        let { name, url } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Task name is required" });
        }

        name = name.trim();

        // ✅ Check table exists
        const table = await pool.query(
            "SELECT * FROM tables WHERE id=$1",
            [tableId]
        );

        if (table.rows.length === 0) {
            return res.status(404).json({ error: "Table not found" });
        }

        // 🔥 Prevent duplicate task (same table)
        const duplicate = await pool.query(
            "SELECT * FROM tasks WHERE table_id=$1 AND LOWER(name)=LOWER($2)",
            [tableId, name]
        );

        if (duplicate.rows.length > 0) {
            return res.status(400).json({ error: "Task already exists in this table" });
        }

        const result = await pool.query(
            "INSERT INTO tasks(table_id, name, url) VALUES($1,$2,$3) RETURNING *",
            [tableId, name, url || null]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("ADD TASK ERROR ❌:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ================= UPDATE TASK =================
exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        let { name, url, completed } = req.body;

        // ✅ Check task exists
        const existingTask = await pool.query(
            "SELECT * FROM tasks WHERE id=$1",
            [taskId]
        );

        if (existingTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Task name is required" });
        }

        name = name.trim();

        const currentTask = existingTask.rows[0];

        // 🔥 Prevent duplicate task name in same table
        const duplicate = await pool.query(
            "SELECT * FROM tasks WHERE table_id=$1 AND LOWER(name)=LOWER($2) AND id != $3",
            [currentTask.table_id, name, taskId]
        );

        if (duplicate.rows.length > 0) {
            return res.status(400).json({ error: "Task with this name already exists" });
        }

        const result = await pool.query(
            "UPDATE tasks SET name=$1, url=$2, completed=$3 WHERE id=$4 RETURNING *",
            [
                name,
                url || null,
                completed !== undefined ? completed : currentTask.completed,
                taskId
            ]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.error("UPDATE TASK ERROR ❌:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ================= DELETE TASK =================
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id=$1 RETURNING *",
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });

    } catch (err) {
        console.error("DELETE TASK ERROR ❌:", err);
        res.status(500).json({ error: "Server error" });
    }
};