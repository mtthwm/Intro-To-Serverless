// require('dotenv').config({path: path.resolve(__dirname, '.env')});
const qs = require('qs');

module.exports = async function (context, req) {
    
    const queryObject = qs.parse(req.body);
    const imageUrl = queryObject.MediaUrl0;

    context.log(queryObject);

    context.res = {
        status: 200, /* Defaults to 200 */
        body: imageUrl ? imageUrl : `Please send an image`,
    };
}