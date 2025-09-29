// Client-side logger for error reporting
class ClientLogger {
  captureException(error: Error, context?: any): string {
    const eventId = this.generateEventId();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${eventId}]`);
      console.error('Error:', error);
      if (context) {
        console.error('Context:', context);
      }
      console.groupEnd();
    }

    // In production, you would send this to an error reporting service
    // like Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(error, context, eventId);
    }

    return eventId;
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): string {
    const eventId = this.generateEventId();
    
    switch (level) {
      case 'error':
        console.error(`[${eventId}] ${message}`);
        break;
      case 'warning':
        console.warn(`[${eventId}] ${message}`);
        break;
      default:
        console.log(`[${eventId}] ${message}`);
    }
    
    return eventId;
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendToErrorService(error: Error, context: any, eventId: string): void {
    // Example implementation for sending to error service
    try {
      // Replace with your error reporting service
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          context,
        }),
      }).catch((fetchError) => {
        console.error('Failed to send error to service:', fetchError);
      });
    } catch (sendError) {
      console.error('Error in sendToErrorService:', sendError);
    }
  }
}

const logger = new ClientLogger();
export default logger;