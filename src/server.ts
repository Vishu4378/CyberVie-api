import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
const app = express();
const storage = multer.memoryStorage();

const PORT = process.env.PORT ?? 5000;
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({ msg: "Hello" });
});

app.post("/upload", multer({ storage }).single("file"), (req, res, next) => {
  try {
    const file = req.file;
    const { username } = req.body;
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
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    fs.writeFile(filename, file.buffer, (err) => {
      if (err) {
        res.status(500).json({ error: "Error on File Upload" });
        return;
      }
      res.json({ msg: "File Upload Successful" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/view", (req, res) => {
  try {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    const filenames = fs.readdirSync("public");
    res.json(filenames);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log("Lsiting on 5000");
});
