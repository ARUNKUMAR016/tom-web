// src/components/ErrorBoundary.jsx
import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
// Link removed

/**
 * Error Boundary to catch JavaScript errors anywhere in the component tree
 * Prevents the entire app from crashing
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // Example: logErrorToMyService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-[3rem] p-8 sm:p-12 text-center border border-brand-dark/5 shadow-xl">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark uppercase tracking-tight mb-4">
              Oops! Something Went Wrong
            </h1>

            {/* Description */}
            <p className="text-brand-dark/60 mb-8 text-lg">
              We encountered an unexpected error. Don't worry, your data is
              safe. Please try refreshing the page or go back to the homepage.
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-8 text-left">
                <summary className="cursor-pointer text-sm font-bold text-brand-dark/40 uppercase tracking-widest hover:text-brand-primary mb-2">
                  Error Details (Dev Only)
                </summary>
                <div className="bg-brand-cream rounded-2xl p-4 text-xs font-mono overflow-auto max-h-64">
                  <p className="text-red-600 font-bold mb-2">
                    {this.state.error.toString()}
                  </p>
                  <pre className="text-brand-dark/60 whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-primary text-white font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-black transition-all"
              >
                <Home className="w-5 h-5" />
                Go Home
              </a>
            </div>

            {/* Help text */}
            <p className="mt-8 text-sm text-brand-dark/40">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
