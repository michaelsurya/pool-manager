
exports.up = function(knex) {
  return knex.schema.createTable("hall_of_fame", table => {
    table.integer("type").notNullable();
    table.string("staffName").unique().notNullable();
    table.integer("wins").defaultTo(0);
    table.integer("plays").defaultTo(0);
    table.integer("percentage").defaultTo(0);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
     return knex.schema.dropTable("bookings");
};
