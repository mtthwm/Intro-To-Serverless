module.exports = async function (context, req) {
    const expectedPassword = "letmein";
    const password = req.query.password;

    const responseMessage = password === expectedPassword ? "Access granted." : "Access denied.";

    context.res = {
        status: password ? 200 : 400,
        body: password ? responseMessage : "please enter a password"
    };
}