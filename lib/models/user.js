'use strict';

const JOI = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return JOI.object({
            id: JOI.number().integer().greater(0).description('User\'s ID'),
            firstName: JOI.string().min(3).example('John').description('User\'s firstname'),
            lastName: JOI.string().min(3).example('Doe').description('User\'s lastname'),
            userName: JOI.string().min(3).example('Kuro').description('User\'s username'),
            password: JOI.string().min(8).example('A1C5Qjfc65DF').description('User\'s password'),
            mail: JOI.string().email({ tlds: { allow: false } }).example('kuro@gmail.com').description('User\'s email'),
            role: JOI.string().valid('user', 'admin', '').example('user').description('User\'s role').default('user').optional(),
            createdAt: JOI.date(),
            updatedAt: JOI.date()
        });
    }

    $beforeInsert(queryContext) {

        if (!this.role) {
            this.role = 'user';
        }

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};
