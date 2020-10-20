const express = require(`express`);
const puppeteer = require(`puppeteer`);
const mongoose = require('mongoose')
const path = require('path')
const app = express();
const myapp = require('./app')
// const PORT = process.env.PORT || 80;
const {Router} = require('./node_modules/express')
const Fork = require('./models/Fork')

// app.use('/api/', require('./routes/home'))

// if(process.env.NODE_ENV === 'production') {
//     app.use('/', express.static(path.join(__dirname, 'client', 'build')))
//     app.get('*', (req, res)=>{
//         res.sendFile(__dirname, 'client', 'build', 'index.html')
//     })
// }
const io = require('socket.io')();

io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(async () => {
      client.emit('timer', await Fork.getForks());
    }, interval);
  });
});

io.listen(443);
console.log('listening on port ', 443);


async function start() {
    try{
        // const url = 'mongodb+srv://cinomus:2cSUNc9MmqN5bDZt@cluster0.zkqqg.mongodb.net/test?retryWrites=true&w=majority'
        // await mongoose.connect(url, {useNewUrlParser:true,useFindAndModify: false})

        await myapp.parse();
        await myapp.compare();
//         app.listen(PORT, ()=>{
//             console.log(`Started on ${PORT}!`);
//         })
    }
    catch (e) {
        console.log(e)
    }

}
start();

