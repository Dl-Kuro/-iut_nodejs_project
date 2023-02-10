'use strict';

const { Service } = require('@hapipal/schmervice');
const EM_ENKRYPTO = require('@dkuro/iut-encrypt');
const JWT = require('@hapi/jwt');


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
            user.password = await EM_ENKRYPTO.encrypt(user.password);
        }

        return User.query().insertAndFetch(user);
    }

    async getAll() {

        const { User } = this.server.models();

        return await User.query().select();
    }

    async deleteById(request) {

        const { id } = request.payload;
        const { User } = this.server.models();
        await User.query().deleteById(id);
    }

    async updateById(user) {

        const { User } = this.server.models();
        if (user.password) {
            user.password = await EM_ENKRYPTO.encrypt(user.password);
        }

        return User.query().patch(user).findById(user.id);
    }

    async login(user) {

        try {
            const { User } = this.server.models();
            const userSearch = await User.query().findOne({
                mail: user.mail
            });

            const isValidPassword = await EM_ENKRYPTO.compare(user.password, userSearch.password);

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
};
