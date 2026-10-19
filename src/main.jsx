import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { MenuProvider } from './context/MenuContext.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Application Render Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#070F22',
          color: '#ffffff',
          padding: '40px 20px',
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            maxWidth: '700px',
            width: '100%',
            backgroundColor: '#091A3E',
            border: '2px solid #ef4444',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}>
            <h2 style={{ color: '#f87171', fontSize: '20px', marginBottom: '12px', fontWeight: 'bold' }}>
              ⚠️ Application Render Exception
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px' }}>
              A client-side runtime error occurred while rendering the page:
            </p>
            <div style={{
              backgroundColor: '#040A18',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #374151',
              color: '#fca5a5',
              fontSize: '13px',
              overflowX: 'auto',
              marginBottom: '16px',
            }}>
              <strong>Error:</strong> {this.state.error?.message || String(this.state.error)}
            </div>
            {this.state.error?.stack && (
              <pre style={{
                backgroundColor: '#040A18',
                padding: '12px',
                borderRadius: '8px',
                color: '#9ca3af',
                fontSize: '11px',
                overflowX: 'auto',
                maxHeight: '200px',
              }}>
                {this.state.error.stack}
              </pre>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              style={{
                marginTop: '16px',
                padding: '10px 20px',
                backgroundColor: '#C5A059',
                color: '#000000',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Clear Local Storage &amp; Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MenuProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </MenuProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
