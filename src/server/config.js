const DB = require("./db");
const db = new DB("../sql/sqlite.db");
module.exports = {
    'secret': '878BF87D547EE21A281BF24BD4725',
    'database': db,
};