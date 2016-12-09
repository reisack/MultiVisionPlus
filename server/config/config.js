var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
module.exports = {
    developpement: {
        db: 'mongodb://localhost/multivision',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production: {
        db: process.env.PROD_MONGODB,
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};