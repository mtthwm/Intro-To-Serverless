const qs = require("qs");

module.exports = async function (context, req) {
    const queryObject = qs.parse(req.body);
    context.log(req.body);
    context.log(queryObject);
    const messageBody = queryObject.Body;

    context.res = {
        status: 200, /* Defaults to 200 */
        body: messageBody,
    };
}