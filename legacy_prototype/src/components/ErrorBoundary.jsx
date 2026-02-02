import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen bg-red-900 text-white p-10 overflow-auto font-mono">
                    <h1 className="text-3xl font-bold mb-4">CRITICAL SYSTEM FAILURE</h1>
                    <div className="bg-black/50 p-6 rounded border border-red-500">
                        <h2 className="text-xl text-red-400 mb-2">ERROR STACK TRACE:</h2>
                        <pre className="whitespace-pre-wrap text-sm text-red-100">
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-500 rounded font-bold"
                    >
                        SYSTEM REBOOT (RELOAD)
                    </button>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="mt-6 ml-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded font-bold"
                    >
                        HARD RESET (CLEAR STORAGE)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
