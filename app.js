const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// const con = require('./models/index');


const usersRoutes = require('./app/routes/usersRoute');
const transactionRoutes = require('./app/routes/transactionRoute');
const statisticsRoutes = require('./app/routes/statisticRoute');

app.use('/users',usersRoutes);
app.use('/transaction',transactionRoutes);
app.use('/all',statisticsRoutes);

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