const createNotification = (type, message) => {
    switch (type) {
      case 'success':
        return { message, color: 'green', icon: 'check' };
      case 'error':
        return { message, color: 'red', icon: 'exclamation' };
      case 'info':
        return { message, color: 'blue', icon: 'info' };
      default:
        return { message, color: 'gray', icon: 'bell' };
    }
  };
  
  export default createNotification;