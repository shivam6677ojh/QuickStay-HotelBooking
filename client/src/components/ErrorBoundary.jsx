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
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900/20 px-4'>
                    <div className='max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center'>
                        <div className='mb-6'>
                            <div className='w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg className='w-10 h-10 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                                </svg>
                            </div>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                                Oops! Something went wrong
                            </h1>
                            <p className='text-gray-600 dark:text-gray-400'>
                                We're sorry for the inconvenience. The page encountered an unexpected error.
                            </p>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <details className='mb-6 text-left bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800'>
                                <summary className='cursor-pointer font-semibold text-red-800 dark:text-red-300 mb-2'>
                                    Error Details (Development Only)
                                </summary>
                                <pre className='text-xs text-red-700 dark:text-red-400 overflow-auto whitespace-pre-wrap break-words'>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className='flex gap-4 justify-center'>
                            <button
                                onClick={() => window.location.reload()}
                                className='px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl'
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className='px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300'
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
