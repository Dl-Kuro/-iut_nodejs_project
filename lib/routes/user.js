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
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    userName: Joi.string().required().min(3).example('Kuro').description('Username of the user'),
                    password: Joi.string().required().min(8).example('A1C5Qjfc65DF').description('Lastname of the user'),
                    mail: Joi.string().email({ tlds: { allow: false } }).example('kuro@gmail.com').description('Email of the user')
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
            await userService.deleteById(request);

            return 'User deleted';
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required().example(1).description('Id unique de l\'utilisateur'),
                    firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                    userName: Joi.string().min(3).example('Kuro').description('Username of the user'),
                    password: Joi.string().min(8).example('A1C5Qjfc65DF').description('Lastname of the user'),
                    mail: Joi.string().email({ tlds: { allow: false } }).example('kuro@gmail.com').description('Email of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            await userService.updateById(request.payload);

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
                payload: Joi.object({
                    mail: Joi.string().email({ tlds: { allow: false } }).example('kuro@gmail.com').description('Email of the user'),
                    password: Joi.string().min(8).example('A1C5Qjfc65DF').description('Lastname of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.login(request.payload);
        }
    }
];
