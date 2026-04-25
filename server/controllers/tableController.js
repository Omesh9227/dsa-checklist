const pool = require("../config/db");

// ================= CREATE TABLE =================
exports.createTable = async (req, res) => {
    try {
        let { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Table name is required" });
        }

        name = name.trim();

        const existing = await pool.query(
            "SELECT 1 FROM tables WHERE LOWER(name) = LOWER($1)",
            [name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Table already exists" });
        }

        const result = await pool.query(
            "INSERT INTO tables(name) VALUES($1) RETURNING *",
            [name]
        );

        return res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("CREATE TABLE ERROR ❌:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// ================= GET TABLES =================
exports.getTables = async (req, res) => {
    try {
        const tablesRes = await pool.query(
            "SELECT * FROM tables ORDER BY id"
        );

        const tables = tablesRes.rows;

        // Fetch tasks in parallel (better performance)
        await Promise.all(
            tables.map(async (table) => {
                const tasksRes = await pool.query(
                    "SELECT * FROM tasks WHERE table_id=$1 ORDER BY id",
                    [table.id]
                );
                table.tasks = tasksRes.rows;
            })
        );

        return res.json(tables);

    } catch (err) {
        console.error("GET TABLE ERROR ❌:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// ================= ADD TASK =================
exports.addTask = async (req, res) => {
    try {
        const { tableId } = req.params;
        let { name, url } = req.body;

        if (!tableId || isNaN(tableId)) {
            return res.status(400).json({ error: "Invalid table ID" });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Task name is required" });
        }

        name = name.trim();

        // Check table exists
        const table = await pool.query(
            "SELECT 1 FROM tables WHERE id=$1",
            [tableId]
        );

        if (table.rows.length === 0) {
            return res.status(404).json({ error: "Table not found" });
        }

        // Duplicate check
        const duplicate = await pool.query(
            "SELECT 1 FROM tasks WHERE table_id=$1 AND LOWER(name)=LOWER($2)",
            [tableId, name]
        );

        if (duplicate.rows.length > 0) {
            return res.status(400).json({ error: "Task already exists in this table" });
        }

        const result = await pool.query(
            "INSERT INTO tasks(table_id, name, url) VALUES($1,$2,$3) RETURNING *",
            [tableId, name, url || null]
        );

        return res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("ADD TASK ERROR ❌:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// ================= UPDATE TASK =================
exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        let { name, url, completed } = req.body;

        if (!taskId || isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const existingTask = await pool.query(
            "SELECT * FROM tasks WHERE id=$1",
            [taskId]
        );

        if (existingTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const currentTask = existingTask.rows[0];

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Task name is required" });
        }

        name = name.trim();

        // Duplicate check
        const duplicate = await pool.query(
            "SELECT 1 FROM tasks WHERE table_id=$1 AND LOWER(name)=LOWER($2) AND id!=$3",
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
                typeof completed === "boolean" ? completed : currentTask.completed,
                taskId
            ]
        );

        return res.json(result.rows[0]);

    } catch (err) {
        console.error("UPDATE TASK ERROR ❌:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// ================= DELETE TASK =================
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId || isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const result = await pool.query(
            "DELETE FROM tasks WHERE id=$1 RETURNING *",
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        return res.json({ message: "Task deleted successfully" });

    } catch (err) {
        console.error("DELETE TASK ERROR ❌:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};