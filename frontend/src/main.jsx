import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { StatsProvider } from './store/StatsContext';
import { ToastProvider } from './components/Toast/ToastProvider';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ToastProvider>
            <StatsProvider>
                <App />
            </StatsProvider>
        </ToastProvider>
    </React.StrictMode>
);
