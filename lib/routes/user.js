'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'get',
        path: '/users',
        options: {
            tags: ['api']
        },

        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.getAll(request);
        }
    },
    {
        method: 'post',
        path: '/user',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user')
                })
            }
        },

        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.create(request.payload);
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required().example(1).description('Id unique de l\'utilisateur')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            await userService.deleteUserById(request);

            return 'The user has been deleted';
        }
    }
];
