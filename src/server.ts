import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
const app = express();
const storage = multer.memoryStorage();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.static("public"));

app.post("/upload", multer({ storage }).single("file"), (req, res, next) => {
  try {
    const file = req.file;
    const { username } = req.body;
    console.log(JSON.stringify(req.body));
    if (!username) {
      res.status(400).json({ error: "Username is not defined" });
      return;
    }
    if (!file?.buffer) {
      res.status(400).json({ error: "file buffer is not defined" });
      return;
    }
    const filename = `public/${
      username + "^^^" + Date.now() + "." + file.originalname.split(".").pop()
    }`;
    fs.writeFile(filename, file.buffer, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Ok");
    });
    res.json("ok");
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/view", (req, res) => {
  try {
    const filenames = fs.readdirSync("public");
    res.json(filenames);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(5000, () => {
  console.log("Lsiting on 5000");
});
