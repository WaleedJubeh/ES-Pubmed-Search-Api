const config = require('./config')
const Express = require('express');
const cors = require('cors');
const routers = require('./routers');

const app = Express();

// middlewares
app.use(cors());
app.use(Express.json());

//routers
app.use(routers);
app.listen(config.PORT, () => {
    console.log(`Server is working on port ${config.PORT}`);
});