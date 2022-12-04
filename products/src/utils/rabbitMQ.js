const amqplib = require('amqplib');
const { v4: uuidvv4} = require('uuid')
require("dotenv").config();
const config = require('../config/rabbitmq.json');
const {ReadContent}= require('./readContent');
const opt = {
  credentials: require('amqplib')
    .credentials.plain(config.USERNAME, config.PASSWORD)
};
const uuid = uuidvv4();

module.exports.CreateChannel = async (payload) => {
  try {
    const connection = await amqplib.connect(config.URL, opt);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.ROUTING_KEY, "direct", { duration: true });
    return channel;
  } catch (err) {
    throw err;
  }
};
module.exports.PublishMessage = async (channel,msg) => {
  const q = await channel.assertQueue('', {exclusive: true});
  
  channel.sendToQueue(process.env.ROUTING_KEY, Buffer.from(msg.toString()), {
    replyTo: q.queue,
    correlationId: uuid
  });
  channel.consume(q.queue, async(msg) => {
    if(msg.properties.correlationId == uuid){
      const response = JSON.parse(msg.content);
      console.log({data:response,queue:q.queue,id:uuid});
    }
  }, {noAck: true});
}
