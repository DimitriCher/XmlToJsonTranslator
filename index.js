const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const upload = require("./multerConfig");
const convertXmlToJson = require("./xmlToJson");

const app = express();

const ensureUploadsDirectory = async () => {
  const uploadsDir = path.join(__dirname, "uploads");
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error("Error creating uploads directory:", err);
  }
};

ensureUploadsDirectory();

app.use(express.static("public"));

app.post("/upload", upload.single("xmlFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const xmlFilePath = path.join(__dirname, req.file.path);

    const jsonFilePath = await convertXmlToJson(xmlFilePath);

    await fs.unlink(xmlFilePath);

    const fileName = path.basename(jsonFilePath);

    res.json({
      message: "File converted",
      downloadEndpoint: `/download/${fileName}`,
    });
  } catch (err) {
    console.error("Error processing upload:", err);
    return res
      .status(400)
      .json({ error: err.message || "An unknown error occurred." });
  }
});

app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;

  const filePath = path.join(__dirname, "uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).json({ error: "File not found." });
    }
  });
});

app.listen(3000, () => {
  console.log(`XmlTranslator at http://localhost:3000`);
});
