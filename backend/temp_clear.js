const database = require("./database");

const clear_db = () => {
  const time = new Date().getTime() - 7200000;
  database.run(`DELETE FROM tempuser WHERE expiration <= ?`, [time]);
};
module.exports = {
  clear_db,
};
