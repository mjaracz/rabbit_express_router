import amqp from 'amqplib/callback_api';
const CONN_URL = 'amqp://izjdyntb:R_Kkru4csLxjQXuSc3-0l5UUqr7r-WAW@bear.rmq.cloudamqp.com/izjdyntb';
let ch = null;

amqp.connect(CONN_URL, (err, conn) => {
  conn.createChannel((err, channel) => {
    ch = channel;
  })
})
export const publishToQueue = async(queueName, data) => {
  await ch.sendToQueue(queueName, new Buffer(data));
}
process.on('exit', (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel with ${code}`);
})
