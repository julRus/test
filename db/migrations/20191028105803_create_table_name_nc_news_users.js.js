exports.up = function(knex) {
  // console.log("creating users table...");
  return knex.schema.createTable("users", usersTable => {
    // usersTable.increments("user_id").primary();
    usersTable
      .string("username")
      .notNullable()
      .primary()
      .unique();
    usersTable.string("name").notNullable();
    usersTable.string("avatar_url").notNullable();
  });
};

exports.down = function(knex) {
  // console.log("removing users table...");
  return knex.schema.dropTable("users");
};
