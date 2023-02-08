'use strict';

const { Service } = require('@hapipal/schmervice');
const el_enkrypto = require('@dkuro/iut-encrypt');


module.exports = class UserService extends Service {

    async create(user) {

        const { User } = this.server.models();
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

            return { login: 'Successful' };
        }
        catch (error) {
            return { statusCode: 401, 'error': 'Unauthorized' };
        }

    }
};
