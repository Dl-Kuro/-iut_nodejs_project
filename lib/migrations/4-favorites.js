'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorites', (table) => {

            table.foreign('user_id').references('id').inTable('user');
            table.foreign('movie_id').references('id').inTable('movie');
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('favorites');
    }
};
