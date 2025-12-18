// import * as amqp from 'amqplib';
const amqplib = require('amqplib/callback_api');

let closing = false;

function handleConnectionError(err, url, onSuccess) {
    console.error("Cannot connect to ", err, ": ", err);
    setTimeout(() => {
        connect(url, onSuccess)
    }, 1000)
}

function handleConnectionResult(err, conn, url, onSuccess) {
    if (err) {
        handleConnectionError(err, url, onSuccess);
    } else {
        conn.once('error', () => {
            if (!closing) {
                conn.close(() => {
                    console.warn('Connection closed');
                });
                handleConnectionError(err, url, onSuccess);
            }
        });
    }
}


function connect(url, onSuccess) {
    amqplib.connect(url, (err, conn) => {
        handleConnectionResult(err, conn, url, onSuccess);
        if (conn && onSuccess) {
            onSuccess(conn);
        }
    });
}

function listen(connection, queue, callback) {
    connection.createChannel((err, channel) => {
        if (err) {
            console.error("Cannot create channel", err);
            connection.emit('error', new Error("Cannot create channel " + channel));
        } else {
            channel.assertQueue(queue);
            console.log("Consuming message from ", queue);
            channel.consume(queue, (msg) => {
                if (msg !== null) {
                    callback(msg.content.toString());
                    channel.ack(msg);
                } else {
                    console.warn('Consumer cancelled by server');
                }
            });
        }
    });
}

function client(connection, queue, callback) {
    connection.createChannel((err, channel) => {
        if (err) {
            console.error("Cannot create channel", err);
            connection.emit('error', new Error("Cannot create channel " + channel));
        } else {
            channel.assertQueue(queue);
            console.log("Client built on queue", queue);
            callback((msg) => channel.sendToQueue(queue, Buffer.from(msg)));
        }
    });
}

function buildListener(
    url,
    queue,
    callback
) {
    connect(url, (connection) => {
        listen(connection, queue, callback);
    });
}

function buildClient(
    url,
    queue,
    callback
) {
    connect(url, (connection) => {
        client(connection, queue, callback);
    });
}

module.exports.client =  buildClient;
module.exports.listener = buildListener;




