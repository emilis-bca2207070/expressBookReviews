const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const authHeader = req.headers.authorization;
    
      if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
    
        jwt.verify(token, 'your_secret_key', (err, user) => { // Verify the token
          if (err) {
            return res.sendStatus(403); // 403 Forbidden if token is invalid
          }
    
          req.user = user; // Add the user info to the request object
          next(); // Proceed to the next middleware/route handler
        });
      } else {
        res.sendStatus(401); // 401 Unauthorized if no token is provided
      }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
