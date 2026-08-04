'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging (no external service)
    console.error('[ErrorBoundary] Rendering error caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[120px] flex flex-col items-center justify-center px-6 py-4 text-center">
          <div className="bg-panel border border-edge/40 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
            <svg
              className="w-12 h-12 text-gold mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L12.3 2.25c-.866-1.5-2.814-1.5-3.68 0L3.047 8.25zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <h2 className="text-white text-lg font-semibold mb-2">
              Une erreur s&apos;est produite
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Veuillez réessayer. Si le problème persiste, contactez-nous à contact@bttspredict.com.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-2.5 bg-gold text-dark-900 font-semibold rounded-lg hover:bg-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
              aria-label="Réessayer"
            >
              Réessayer
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
