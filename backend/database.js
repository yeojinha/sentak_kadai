const mariadb = require("mariadb");
const pool = mariadb.createPool({
  // sentaku.cpa30qpcmbnd.ap-northeast-1.rds.amazonaws.com
  // host: "127.0.0.1",
  host: "sentaku.cpa30qpcmbnd.ap-northeast-1.rds.amazonaws.com",
  // user: "root",
  user: "admin",
  // password: "4966",
  password: "hahooho4966",
  connectionLimit: 5,
  database: "sentaku",
});
module.exports = {
  async run(query, params) {
    return new Promise((resolve, reject) => {
      pool
        .getConnection()
        .then((conn) => {
          conn
            .query(query, params)
            .then((rows) => {
              resolve(rows);

              conn.end(); // (필수) connection 종료
            })
            .catch((err) => {
              console.log(err);
              conn.end(); // (필수) connection 종료
              reject(err);
            });
        })
        .catch((err) => {
          //not connected
          console.log(err);
          reject(err);
        });
    });
  },
};
