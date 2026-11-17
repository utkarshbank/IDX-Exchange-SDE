import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Render error caught by ErrorBoundary:", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="page error-boundary" role="alert">
        <h1>Something went wrong</h1>
        <p className="muted">
          This page hit an unexpected error. You can try again or head back to the listings.
        </p>
        <div className="actions">
          <button type="button" onClick={this.reset}>Try again</button>
          <a href="/">Back to listings</a>
        </div>
      </div>
    );
  }
}