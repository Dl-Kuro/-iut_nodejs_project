'use strict';

const JOI = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return JOI.object({
            id: JOI.number().integer().greater(0).description('Movie\'s ID'),
            title: JOI.string().min(3).example('Kalaaalee').description('Movie\'s title'),
            description: JOI.string().min(3).example('Kalale kakale lakela').description('Movie\'s description'),
            releaseDate: JOI.date(),
            producer: JOI.string().min(3).example('Kalale').description('Movie\'s producer'),
            createdAt: JOI.date(),
            updatedAt: JOI.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};
