const amqplib = require('amqplib');
require("dotenv").config();
const config = require('../config/rabbitmq.json');
const UserService = require('../api/services/user');
const opt = {
  credentials: require('amqplib')
    .credentials.plain(config.USERNAME, config.PASSWORD)
};
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(config.URL, opt);
    const channel = await connection.createChannel();
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.SubscribeMessage = async (channel) => {
    await channel.assertQueue(process.env.ROUTING_KEY,'direct', {durable: true});
    console.log(`Waiting RPC requests from ${process.env.ROUTING_KEY}`);
  
    channel.consume(process.env.ROUTING_KEY, async(msg) => {
      console.log({queue: process.env.ROUTING_KEY});
      const service = new UserService();

      const response = await service.SubscribeEvents(msg.content);
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
        correlationId: msg.properties.correlationId
      });
  
      channel.ack(msg);
  
    }, {noAck: false})
};
