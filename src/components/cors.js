// corsMiddleware.js
function corsMiddleware(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/'); // Replace with your React app's URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Continue to the next middleware
    next();
}

module.exports = corsMiddleware;
