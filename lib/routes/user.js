'use strict';

const JOI = require('joi');

module.exports = [
    {
        method: 'get',
        path: '/users',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.getAll();
        }
    },
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    firstName: JOI.string().required().min(3).example('John').description('User\'s firstname'),
                    lastName: JOI.string().required().min(3).example('Doe').description('User\'s lastname'),
                    userName: JOI.string().required().min(3).example('Kuro').description('User\'s username'),
                    password: JOI.string().required().min(8).example('A1C5Qjfc65DF').description('User\'s password'),
                    mail: JOI.string().email({ tlds: { allow: false } }).example('kuro@gmail.com').description('User\'s email'),
                    role: JOI.string().valid('user', 'admin', '').example('user').description('User\'s role').default('user').optional()
                })
            }
        },
        handler: async (request, h) => {

            const { userService, mailService } = request.services();
            await mailService.sendMail(request.payload, 'Hello ✔', 'Hello world ?');

            return userService.create(request);
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    id: JOI.number().integer().required().example(1).description('User\'s ID')
                })
            }
        },
        handler: async (request) => {

            const { userService } = request.services();
            await userService.deleteById(request);

            return 'User deleted';
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    id: JOI.number().integer().required().example(1).description('User\'s ID'),
                    firstName: JOI.string().min(3).example('John').description('User\'s firstname'),
                    lastName: JOI.string().min(3).example('Doe').description('User\'s lastname'),
                    userName: JOI.string().min(3).example('Kuro').description('User\'s username'),
                    password: JOI.string().min(8).example('A1C5Qjfc65DF').description('User\'s password'),
                    mail: JOI.string().email({ tlds: { allow: false } }).example('kuro@gmail.com').description('User\'s email'),
                    role: JOI.string().valid('user', 'admin', '').example('user').description('User\'s role').default('user').optional()
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            await userService.updateById(request);

            return 'User updated';
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    mail: JOI.string().email({ tlds: { allow: false } }).example('kuro@gmail.com').description('User\'s email'),
                    password: JOI.string().min(8).example('A1C5Qjfc65DF').description('User\'s password')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.login(request);
        }
    },
    {
        method: 'post',
        path: '/user/addFavorite',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    movie_id: JOI.number().integer().greater(0).example('1').description('Movie\'s ID')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.addFavorite(request);
        }
    },
    {
        method: 'delete',
        path: '/user/removeFavorite',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    movie_id: JOI.number().integer().greater(0).example('1').description('Movie\'s ID')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            await userService.removeFavorite(request);

            return 'Favorite deleted';
        }
    }
];
