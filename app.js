import express from 'express';
import bodyParser from 'body-parser';
import user from './routes/user';
import {MongoClient} from 'mongodb';
import {clientApiKeyValidation} from './common/authUtils';

const CONN_URL = 'mongodb://localhost:27017';
let mongoClient = null;

MongoClient.connect(CONN_URL, {useNewUrlParser: true}, function (err, client) {
  mongoClient = client;
})

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.db = mongoClient.db('test');
  next();
});

app.use(clientApiKeyValidation);

app.get('/', (req, res, next) => {
  res.status(200).send({
    status: true,
    response: 'Hello World!'
  });
});

app.use('/user', user);

app.use((req, res, next) => {
  if(!res.data) {
    return res.status(404).send({
      status: false,
      error: {
        reason: "Invalid Endpoint",
        code: 404
      }
    });
  }

  res.status(res.statusCode || 200).send({status: true, response: res.data});
})

app.listen(8080, () => {
  console.log(' ********** : running on 8080');
})

process.on('exit', (code) => {
  mongoClient.close();
  console.log(`About to exit with code: ${code}`);
});


process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  process.exit();
});


module.exports = app;