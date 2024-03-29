import {Router} from 'express';

let router = Router();
import {getUserDetails} from '../services/UserService';
import {publishToQueue} from '../services/RabbitClient';

router.post('/hello', async(req, res, next) => {
  let uname = req.body.username;
  let userDetails = await getUserDetails(req.db, uname);
  res.statusCode = 200;
  res.data = userDetails;
  next();
});

router.get('/', async (req, res, next) => {
  res.status(200).send({"body":"example body"})
})

router.post('/msg', async(req, res, next) => {
  let {queueName, payload} = req.body;
  await publishToQueue(queueName, payload);
  res.statusCode = 200;
  res.data = {"message-sent": true};
  next();
});

export default router;