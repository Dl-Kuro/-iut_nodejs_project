'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {

    async create(request) {

        const { Movie, User } = this.server.models();
        const { mailService } = request.services();
        const users = await User.query().select();
        const movie = request.payload;

        for (const user of users) {
            mailService.sendMail(user.mail, 'A movie was created', movie.title + ' from was vreated');
        }

        return await Movie.query().insertAndFetch(movie);
    }

    async getAll() {

        const { Movie } = this.server.models();

        return await Movie.query().select();
    }

    async deleteById(request) {

        const { Movie } = this.server.models();
        const { id } = request.payload;
        await Movie.query().deleteById(id);
    }

    async updateById(request) {

        const { Movie, User, Favorites } = this.server.models();
        const { mailService } = request.services();
        const users = await User.query().select();
        const movie = request.payload;

        for (const user of users) {
            const favorites = await Favorites.query().select()
                .where('user_id', '=', user.id)
                .where('movie_id', '=', movie.id);

            if (favorites.length !== 0) {
                mailService.sendMail(user.mail, 'A movie was updated', movie.title + ' from yours favorites was updated');
            }
        }

        return await Movie.query().patch(movie).findById(movie.id);
    }
};
