import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gestor Publicitario',
            version: '1.0.0',
            description: 'Un sistema para el manejo de publicidades de emisora de radio.',
            contact: {
                name: 'DSW UTN - Peinado, Del Solar, Brancatti'
            },
            servers: [
                {
                    url: 'http://localhost:3001/api',
                    description: 'Local Server'
                }
            ],
        },
    },
    apis: ['./src/swagger/documentation.yml'],
};




const configSwagger = swaggerJsdoc(options);
export default configSwagger






