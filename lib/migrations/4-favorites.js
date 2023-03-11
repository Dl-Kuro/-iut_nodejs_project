'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorites', (table) => {

            table.integer('user_id').unsigned();
            table.integer('movie_id').unsigned();
            table.foreign('user_id').references('id').inTable('user');
            table.foreign('movie_id').references('id').inTable('movie');
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('favorites');
    }
};
