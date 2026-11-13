"use client";

import React from "react";

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("StayScout crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto my-16 max-w-lg rounded-2xl border border-rosex/40 bg-rosex/10 p-8 text-center">
          <p className="text-3xl">🛠️</p>
          <h2 className="mt-3 text-lg font-semibold text-white">
            Something broke while rendering
          </h2>
          <p className="mt-2 break-words font-mono text-xs text-rosex">
            {this.state.error.message}
          </p>
          <button
            onClick={() => {
              this.setState({ error: null });
            }}
            className="btn-primary mt-6"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
