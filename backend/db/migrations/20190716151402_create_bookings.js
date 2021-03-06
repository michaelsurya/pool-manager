exports.up = function(knex) {
  return knex.schema.createTable("bookings", table => {
    table.increments();
    table.unique(["start","end"]);
    table.string("start").notNullable();
    table.string("end").notNullable();
    table.string("player1").notNullable();
    table.string("player2").notNullable();
    table.string("title").notNullable();
    table.string("messageId");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("bookings");
};
