import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>משהו השתבש.</h1>
          <p>{this.state.error?.message || 'שגיאה לא ידועה'}</p>
          <button onClick={() => window.location.reload()}>נסה שוב</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;