'use strict';

module.exports = {
    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            table.string('userName').notNull();
            table.string('password').notNull();
            table.string('mail').notNull();
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {

            table.dropColumn('userName');
            table.dropColumn('password');
            table.dropColumn('mail');
        });
    }
};
