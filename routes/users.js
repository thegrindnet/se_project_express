const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("GET Users route is working");
});
router.get("/:userId", (req, res) => {
  res.send("GET User by ID route is working");
});
router.post("/", (req, res) => {
  res.send("POST User route is working");
});

module.exports = router;
