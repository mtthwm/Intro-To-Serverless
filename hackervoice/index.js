module.exports = async function (context, req) {
    const password = req.query.password;
    const responseMessage = password;

    context.res = {
        status: password ? 200 : 400,
        body: password ? responseMessage : "please enter a password"
    };
}