var fs = require('fs');

export default {

    read : (file) => {

        return new Promise((resolve, reject) => {
            fs.readFile(file[0], 'utf8' , (err, data) => {
                if ( err ) reject(err)
                resolve(data);
            });
        });
    },

    write : ( file , content ) => {

        return new Promise ((resolve , reject) => {
            fs.writeFile(file , content , 'utf8' , ( err , data ) => {
                if ( err ) reject(err);
                resolve(data);
            });
        });
    }
    
} 