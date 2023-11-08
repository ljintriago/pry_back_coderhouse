function readDataFromFile(filename) {
    try {
      const data = fs.readFileSync(filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer ${filename}: ${error.message}`);
      return [];
    }
}
  
function writeDataToFile(filename, data) {
    try {
      fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error al escribir en ${filename}: ${error.message}`);
    }
}

module.exports = { readDataFromFile, writeDataToFile };