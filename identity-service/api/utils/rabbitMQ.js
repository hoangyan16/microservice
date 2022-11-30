const amqplib = require('amqplib');
require("dotenv").config();
const config = require('../../config/rabbitmq.json');
const opt = {
    credentials: require('amqplib')
        .credentials.plain(config.USERNAME, config.PASSWORD)
};
module.exports.CreateChannel = async () => {
    try {
      const connection = await amqplib.connect(config.URL, opt);
      const channel = await connection.createChannel();
      await channel.assertQueue(process.env.ROUTING_KEY);
      return channel;
    } catch (err) {
      throw err;
    }
  };
