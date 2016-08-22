/*
 * peer-to-peer chat!
 */

"use strict";

function PeerChat(apiKey) {
  var self = this;
  self.apiKey = apiKey;
  self.connectionData = {};
  self.messageLog = [];
  self.onMessageHandler = function(data) {};
  self.onConnectionHandler = function(data) {};

  self.setName = function(name) {
    var connectionData = self.connectionData;
    var receiveTextConnection = self.receiveTextConnection;
    connectionData.name = name;
    console.log("Hello, "+connectionData.name);
    if(connectionData.peer != null)
      connectionData.peer.destroy();
    connectionData.peer = new Peer(name,{key: self.apiKey});
    connectionData.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
    });
    connectionData.peer.on('connection', receiveTextConnection);
  }

  self.openTextConnection = function(id) {
    var connectionData = self.connectionData;
    var sendName = self.sendName;
    console.log("opentextconnection: connectionData",connectionData);
    var dataConnection = connectionData.peer.connect(id);
    var displayReceivedText = self.displayReceivedText;
    dataConnection.on('data', displayReceivedText );
    dataConnection.on('open', sendName );
    connectionData.connection = dataConnection;
  }

  self.sendName = function() {
    var connectionData = self.connectionData;
    console.log("this: ", self);
    console.log("connectionData: ",connectionData);
    connectionData.connection.send({introduce: connectionData.name});
  }

  self.receiveTextConnection = function(dataConnection) {
    var connectionData = self.connectionData;
    var displayReceivedText = self.displayReceivedText;
    var sendName = self.sendName;
    console.log('Received A Text Connection!');
    dataConnection.on('data', displayReceivedText );
    dataConnection.on('open', sendName );
    connectionData.connection = dataConnection;
  }


  self.onMessage = function(callback) {
    self.onMessageHandler = callback;
  }

  self.onConnection = function(callback) {
    self.onConnectionHandler = callback;
  }

  self.addMessage = function(messageData) {
    console.log("addmessage, this: ",this);
    self.messageLog.push(messageData);
    console.log(messageData);
    self.onMessageHandler(messageData);
  }

  self.displayReceivedText = function(data) {
    var message;
    var addMessage = self.addMessage;
    var onConnectionHandler = self.onConnectionHandler;
    if(data.introduce != null) {
      message = 'Connected to '+data.introduce;
      console.log(message);
      console.log(data);
      onConnectionHandler(data);
    }
    addMessage(data);
  }

  self.send = function(text) {
    var data, message;
    var connectionData = self.connectionData;
    var addMessage = self.addMessage;

    if(connectionData.connection == null)
      return;
    data = {name: connectionData.name, time: Date.now(), text: text};
    connectionData.connection.send(data);
    addMessage(data);
  }

};

// PeerChat.prototype.setName = function(name) {
//   var connectionData = this.connectionData;
//   var receiveTextConnection = this.receiveTextConnection();
//   connectionData.name = name;
//   console.log("Hello, "+connectionData.name);
//   if(connectionData.peer != null)
//     connectionData.peer.destroy();
//   connectionData.peer = new Peer(name,{key: 'scri73s3zcucjtt9'});
//   connectionData.peer.on('open', function(id) {
//     console.log('My peer ID is: ' + id);
//   });
//   connectionData.peer.on('connection', receiveTextConnection);
// }

// PeerChat.prototype.openTextConnection = function(id) {
//   var connectionData = this.connectionData;
//   var sendName = this.sendName();
//   console.log("opentextconnection: connectionData",connectionData);
//   var dataConnection = connectionData.peer.connect(id);
//   var displayReceivedText = this.displayReceivedText();
//   dataConnection.on('data', displayReceivedText );
//   dataConnection.on('open', sendName );
//   connectionData.connection = dataConnection;
// }

// PeerChat.prototype.sendName = function() {
//   var connectionData = this.connectionData;
//   return (function() {
//     console.log("this: ",this);
//     console.log("connectionData: ",connectionData);
//     connectionData.connection.send({introduce: connectionData.name});
//   });
// }

// PeerChat.prototype.receiveTextConnection = function() {
//   var connectionData = this.connectionData;
//   var displayReceivedText = this.displayReceivedText();
//   var sendName = this.sendName();
//   return (function(dataConnection) {
//     console.log('Received A Text Connection!');
//     dataConnection.on('data', displayReceivedText );
//     dataConnection.on('open', sendName );
//     connectionData.connection = dataConnection;
//   });
// }

// PeerChat.prototype.onMessage = function(callback) {
//   this.onMessageHandler = callback;
// }

// PeerChat.prototype.onConnection = function(callback) {
//   this.onConnectionHandler = callback;
// }

// PeerChat.prototype.addMessageHandler = function() {
//   var self = this;
//   return (function(messageData) {
//     console.log("addmessage, this: ",this);
//     self.messageLog.push(messageData);
//     console.log(messageData);
//     self.onMessageHandler(messageData);
//   });
// }

// PeerChat.prototype.displayReceivedText = function() {
//   var self = this;
//   var message;
//   var addMessage = this.addMessageHandler();
//   var onConnectionHandler = this.onConnectionHandler;
//   return (function(data) {
//     if(data.introduce != null) {
//       message = 'Connected to '+data.introduce;
//       console.log(message);
//       console.log(data);
//       onConnectionHandler(data);
//     }
//     addMessage(data);
//   });
// }

// PeerChat.prototype.send = function(text) {
//   var data, message;
//   var connectionData = this.connectionData;
//   var addMessage = this.addMessageHandler();

//   if(connectionData.connection == null)
//     return;
//   data = {name: connectionData.name, time: Date.now(), text: text};
//   connectionData.connection.send(data);
//   addMessage(data);
// }

