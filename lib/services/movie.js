'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {

    async create(movie) {

        const { Movie } = this.server.models();

        return await Movie.query().insertAndFetch(movie);
    }

    async getAll() {

        const { Movie } = this.server.models();

        return await Movie.query().select();
    }

    async deleteById(request) {

        const { id } = request.payload;
        const { Movie } = this.server.models();
        await Movie.query().deleteById(id);
    }

    async updateById(movie) {

        const { Movie } = this.server.models();

        return await Movie.query().patch(movie).findById(movie.id);
    }
};
