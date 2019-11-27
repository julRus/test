exports.up = function(knex) {
  // console.log("table articles created...");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable
      .string("topic")
      .references("topics.slug")
      .onDelete("CASCADE");
    articlesTable
      .string("author")
      .references("users.username")
      .onDelete("CASCADE");
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  // console.log("removing articles table...");
  return knex.schema.dropTable("articles");
};
