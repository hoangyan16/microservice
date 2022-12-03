const amqplib = require('amqplib');
require("dotenv").config();
const config = require('../../config/rabbitmq.json');
const { v4: uuidvv4 } = require('uuid');
const opt = {
  credentials: require('amqplib')
    .credentials.plain(config.USERNAME, config.PASSWORD)
};
module.exports.CreateChannel = async (payload) => {
  try {
    const connection = await amqplib.connect(config.URL, opt);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.EXCHANGE_NAME, 'topic', { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(process.env.EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};

module.exports.SubscribeMessage = async (channel, service) => {
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, process.env.EXCHANGE_NAME);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};