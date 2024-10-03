const fs = require("fs").promises;
const xml2js = require("xml2js");
const path = require("path");

/**
 * Converts an XML file to JSON and saves it to a file.
 * @param {string} xmlFilePath - The path to the XML file.
 * @returns {Promise<string>} - A promise that resolves to the JSON file path.
 */
const convertXmlToJson = async (xmlFilePath) => {
  try {
    const xmlData = await fs.readFile(xmlFilePath, "utf8");

    const parser = new xml2js.Parser({ explicitArray: false });
    const jsonResult = await parser.parseStringPromise(xmlData);

    const jsonFileName = `${Date.now()}-output.json`;
    const jsonFilePath = path.join(__dirname, "uploads", jsonFileName);

    await fs.writeFile(jsonFilePath, JSON.stringify(jsonResult, null, 2));

    return jsonFilePath;
  } catch (err) {
    throw new Error(`Error processing XML file: ${err.message}`);
  }
};

module.exports = convertXmlToJson;
