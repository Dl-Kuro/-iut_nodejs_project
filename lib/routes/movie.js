'use strict';

const JOI = require('joi');

module.exports = [
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.getAll();
        }
    },
    {
        method: 'post',
        path: '/movie',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    title: JOI.string().min(3).example('Kalaaalee').description('Movie\'s title'),
                    description: JOI.string().min(3).example('Kalale kakale lakela').description('Movie\'s description'),
                    releaseDate: JOI.date(),
                    producer: JOI.string().min(3).example('Kalale').description('Movie\'s director')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.create(request);
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    id: JOI.number().integer().required().example(1).description('Movie\'s ID')
                })
            }
        },
        handler: async (request) => {

            const { movieService } = request.services();
            await movieService.deleteById(request);

            return 'Movie deleted';
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: JOI.object({
                    id: JOI.number().integer().example(1).description('Movie\'s ID'),
                    title: JOI.string().min(3).example('Kalaaalee').description('Movie\'s title'),
                    description: JOI.string().min(3).example('Kalale kakale lakela').description('Movie\'s description'),
                    releaseDate: JOI.date(),
                    producer: JOI.string().min(3).example('Kalale').description('Movie\'s director')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();
            await movieService.updateById(request);

            return 'Movie updated';
        }
    }
];
