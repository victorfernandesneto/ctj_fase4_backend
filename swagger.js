const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CTJ Fase 4 Backend API',
            version: '1.0.0',
            description: 'API para registro de espaços e reservas',
        },
    },
    apis: ['./app.js'],
};

module.exports = options;