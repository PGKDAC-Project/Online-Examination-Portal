import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can later send this to backend / logging service
    console.error("Global Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#111",
            color: "#fff",
            padding: "2rem",
            textAlign: "center"
          }}
        >
          <h1>Something went wrong</h1>
          <p>
            An unexpected error occurred. Please refresh the page or contact
            support.
          </p>

          <pre
            style={{
              background: "#222",
              padding: "1rem",
              borderRadius: "6px",
              maxWidth: "600px",
              overflowX: "auto",
              color: "#f88"
            }}
          >
            {this.state.error?.message}
          </pre>

          <button
            onClick={this.handleReload}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              border: "none",
              background: "#0d6efd",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
