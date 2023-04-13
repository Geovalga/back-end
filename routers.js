const router = require("express").Router();
const client = require("./connection");
const { ObjectId } = require("mongodb");

router.get("/users", async (req, res) => {
  const db = client.db("test");
  const result = await db.collection("users").find().toArray();
  res.send({ status: "success", message: "list users", data: result });
});

router.get("/users/:id", async (req, res) => {
  try {
    const db = client.db("test");
    const users = await db
      .collection("users")
      .find({ _id: ObjectId(req.params.id) })
      .toArray();

    if (users.length > 0) {
      res.send({ status: "success", messsage: "single user", data: users });
    } else {
      res.send({
        status: "warning",
        messsage: "data tidak ditemukan",
        data: users,
      });
    }
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});

module.exports = router;
