'use strict';

const { Service } = require('@hapipal/schmervice');
const el_enkrypto = require('@dkuro/iut-encrypt');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    async create(user) {

        const { User } = this.server.models();
        const userSearch = await User.query().findOne({
            mail: user.mail
        });

        if (userSearch) {
            return { create: 'Email already in use' };
        }

        if (user.password) {
            user.password = await el_enkrypto.encrypt(user.password);
        }

        return await User.query().insertAndFetch(user);
    }

    async getAll(request) {

        const { User } = request.models();

        return await User.query().select();
    }

    async deleteById(request) {

        const { id } = request.payload;
        const { User } = request.models();
        await User.query().deleteById(id);
    }

    async updateById(user) {

        const { User } = this.server.models();
        if (user.password) {
            user.password = await el_enkrypto.encrypt(user.password);
        }

        return User.query().patch(user).findById(user.id);
    }

    async login(user) {

        try {
            const { User } = this.server.models();
            const userSearch = await User.query().findOne({
                mail: user.mail
            });

            const isValidPassword = await el_enkrypto.compare(user.password, userSearch.password);

            if (!isValidPassword) {
                return { login: 'Invalid Password' };
            }

            const token = this.generateToken(userSearch);
            return { token };
        } catch (error) {
            return { statusCode: 401, 'error': 'Unauthorized' };
        }
    }

    generateToken(user) {

        return Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.mail,
                scope: user.role
            },
            {
                key: 'random_string', // La clé qui est définie dans lib/auth/strategies/jwt.js
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );
    }
};
