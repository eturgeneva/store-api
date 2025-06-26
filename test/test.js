// Must be inside a test
// Adds this middleware as the first one in the middleware stack
let user = {};
let isAuthenticated = true;

app.stack.unshift({
    route: '',
    handle: function (req, res, next) {
        req.user = user;
        
        req.isAuthenticated = () => isAuthenticated;

        // req.user = {};

        // req.isAuthenticated = function () {
        //     return true;
        // };

        next();
    }
});

