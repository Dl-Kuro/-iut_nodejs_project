'use strict';

const { Service } = require('@hapipal/schmervice');
const EL_ENKRYPTO = require('@dkuro/iut-encrypt');
const JWT = require('@hapi/jwt');


module.exports = class UserService extends Service {

    async create(request) {

        const { User } = this.server.models();
        const user = request.payload;
        const userSearch = await User.query().findOne({
            mail: user.mail
        });

        if (userSearch) {
            return { create: 'Email already in use' };
        }

        if (user.password) {
            user.password = await EL_ENKRYPTO.encrypt(user.password);
        }

        return User.query().insertAndFetch(user);
    }

    async getAll() {

        const { User } = this.server.models();

        return await User.query().select();
    }

    async deleteById(request) {

        const { User } = this.server.models();
        const { id } = request.payload;
        await User.query().deleteById(id);
    }

    async updateById(request) {

        const { User } = this.server.models();
        const user = request.payload;

        if (user.password) {
            user.password = await EL_ENKRYPTO.encrypt(user.password);
        }

        return User.query().patch(user).findById(user.id);
    }

    async login(request) {

        try {
            const { User } = this.server.models();
            const user = request.payload;
            const userSearch = await User.query().findOne({
                mail: user.mail
            });

            const isValidPassword = await EL_ENKRYPTO.compare(user.password, userSearch.password);

            if (!isValidPassword) {
                return { login: 'Invalid Password' };
            }

            const token = this.generateToken(userSearch);
            return { token };
        }
        catch (error) {
            return { statusCode: 401, 'error': 'Unauthorized' };
        }
    }

    generateToken(user) {

        return JWT.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.mail,
                scope: user.role
            },
            {
                key: process.env.API_KEY, // La clé qui est définie dans lib/auth/strategies/jwt.js
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );
    }


    async addFavorite(request) {

        const { Favorites, Movie } = this.server.models();
        const movie = await Movie.query().select('id')
            .whereRaw('?? = ??', ['id', request.payload.movie_id]);

        if (movie.length !== 0) {
            const favorites = await Favorites.query().select()
                .whereRaw('?? = ?? AND ?? = ??', ['user_id', request.auth.credentials.id, 'movie_id', request.payload.movie_id]);

            if (favorites.length !== 0) {
                return { error: 'Movie already in favorites' };
            }

            return Favorites.query().insertAndFetch({
                'user_id': request.auth.credentials.id,
                'movie_id': request.payload.movie_id
            });
        }

        return { error: 'Problem encountered while adding a favorite movie to a user' };
    }

    async removeFavorite(request) {

        const { Favorites } = this.server.models();

        return await Favorites.query().delete()
            .where('user_id', '=', request.auth.credentials.id)
            .where('movie_id', '=', request.payload.movie_id);
    }
};
