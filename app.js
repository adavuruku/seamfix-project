const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



const usersRoutes = require('./app/routes/userRoute');
const ninRoutes = require('./app/routes/ninRoute');

app.use('/api/user',usersRoutes,ninRoutes);
// app.use('/api/user',ninRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);
});


app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    });
});

module.exports = app;