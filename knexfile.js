const { DB_URL } = process.env;
const { client } = require("pg");
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_messenger",
      username: "julia",
      password: "myPassword"
      // user,
      // password
    }
  },
  test: {
    connection: {
      database: "nc_messenger",
      username: "julia",
      password: "myPassword"
      // user,
      // password
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
