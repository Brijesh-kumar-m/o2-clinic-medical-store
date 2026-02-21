import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEF2F2', color: '#991B1B', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p style={{ maxWidth: '600px', marginBottom: '1rem', fontFamily: 'monospace', backgroundColor: '#FEE2E2', padding: '1rem', borderRadius: '0.5rem' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: '800px', overflow: 'auto' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
