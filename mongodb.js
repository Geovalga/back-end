const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

(async () => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("test");

    db.collection("users")
      .find()
      .toArray((err, result) => {
        if (err) throw err;

        console.log(result);
      });
  } catch (error) {
    console.log(error);
  }
})();
