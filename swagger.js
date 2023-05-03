const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
// const endpointsFiles = ['./routes/userRoutes.js','./routes/intersectionRoutes.js','./routes/signalRoutes.js','./index.js']
const endpointsFiles = ['./index.js']

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index.js')
})