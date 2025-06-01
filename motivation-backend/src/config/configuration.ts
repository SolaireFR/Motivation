export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    mongodb: {
        host: process.env.MONGODB_HOST || 'localhost',
        port: parseInt(process.env.MONGODB_PORT || '27017', 10),
        user: process.env.MONGODB_USER || 'admin',
        password: process.env.MONGODB_PASSWORD || 'password',
        database: process.env.MONGODB_DATABASE || 'motivation',
        uri: process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/motivation?authSource=admin',
    },

    swagger: {
        title: process.env.SWAGGER_TITLE || 'Motivation API',
        description: process.env.SWAGGER_DESCRIPTION || 'API pour la gestion des tâches et du budget de motivation',
        version: process.env.SWAGGER_VERSION || '1.0',
        path: process.env.SWAGGER_PATH || 'api',
    },
});
