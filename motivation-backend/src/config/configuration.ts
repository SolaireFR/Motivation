export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    mongodb: {
        host: process.env.MONGODB_HOST || 'localhost',
        port: parseInt(process.env.MONGODB_PORT || '27017', 10),
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
        database: process.env.MONGODB_DATABASE,
        uri: process.env.MONGODB_URI,
    },

    swagger: {
        title: process.env.SWAGGER_TITLE || 'Motivation API',
        description: process.env.SWAGGER_DESCRIPTION || 'API pour la gestion des tâches et du budget de motivation',
        version: process.env.SWAGGER_VERSION || '1.0',
        path: process.env.SWAGGER_PATH || 'api',
    },
});
