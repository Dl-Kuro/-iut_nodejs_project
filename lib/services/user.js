'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserService extends Service {

    create(id) {

        const { User } = this.server.models();

        return User.query().insertAndFetch(id);
    }

    getAll(request) {

        const { User } = request.models();

        return User.query().select();
    }

    async deleteUserById(request) {

        const { id } = request.payload;
        const { User } = request.models();
        await User.query().deleteById(id);
    }
};
