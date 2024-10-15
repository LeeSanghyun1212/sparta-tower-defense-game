const sendEvent = (handlerId, payload) => {
    socket.emit('event', {
      userId,
      clientVersion: CLIENT_VERSION,
      handlerId,
      payload,
    });
  };
  
  export { sendEvent };