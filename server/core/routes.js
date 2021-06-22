const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Routes
routes.use('/token', async (req, res, next) => {

    let Client_Id = req.body.Client_Id || req.body.client_id;
    let Client_Secret = req.body.Client_Secret || req.body.client_secret;

    try {

        if (Client_Id && Client_Secret) {
            if (Client_Id === process.env.API_CLIENT_ID && Client_Secret === process.env.API_CLIENT_SECRET) {
                let token = jwt.sign({ username: Client_Id },
                    process.env.API_SECRET,
                    {
                        expiresIn: '1h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    access_token: token,
                    expires_in: 3600,
                    token_type: 'Bearer'
                });
            } 
            else {
                res.status(401).sendData({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.status(400).sendData({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }

    } catch (error) {
        next(error)
    }

});

router.post('/login', (req, res)=>{
    res.status(200).send({success: true})
});

module.exports = router;