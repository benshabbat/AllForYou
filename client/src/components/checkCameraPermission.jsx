async function checkCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // אם הגענו לכאן, יש לנו הרשאה. נסגור את הזרם.
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        console.error('Camera permission denied:', err);
        return false;
      } else {
        console.error('Error accessing camera:', err);
        return false;
      }
    }
  }
  
  export default checkCameraPermission;