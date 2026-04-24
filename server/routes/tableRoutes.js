const router = require("express").Router();
const controller = require("../controllers/tableController");

router.post("/table", controller.createTable);
router.get("/table", controller.getTables);
router.post("/table/:tableId/task", controller.addTask);
router.put("/task/:taskId", controller.updateTask);
router.delete("/task/:taskId", controller.deleteTask);

module.exports = router;