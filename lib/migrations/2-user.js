'use strict';

module.exports = {
    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            table.string('role').notNull();
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {

            table.dropColumn('role');
        });
    }
};
