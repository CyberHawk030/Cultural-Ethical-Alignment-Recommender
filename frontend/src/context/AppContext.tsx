import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Define the shape of our context data
interface AppContextType {
    // State
    googleApiKey: string;
    isApiKeySet: boolean;
    isKbReady: boolean;
    criticalPenalty: number;
    minorPenalty: number;
    finalReport: string | null; // Can be null initially
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;

    // State Setters & Handlers
    setGoogleApiKey: (key: string) => void;
    handleConfigureKey: () => Promise<void>;
    handleProcessDocs: (files: FileList | null) => Promise<void>;
    setCriticalPenalty: (val: number) => void;
    setMinorPenalty: (val: number) => void;
    handleRunAnalysis: (formData: FormData) => Promise<void>;
    handleViewReport: (reportId: string) => Promise<void>; // New handler to view a specific report
    clearReportAndNavigate: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();

    // State definitions
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [isApiKeySet, setIsApiKeySet] = useState(false);
    const [isKbReady, setIsKbReady] = useState(false);
    const [criticalPenalty, setCriticalPenalty] = useState(30);
    const [minorPenalty, setMinorPenalty] = useState(10);
    const [finalReport, setFinalReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleConfigureKey = async () => {
        if (!googleApiKey) { setError('Please enter an API Key.'); return; }
        setIsLoading(true); setLoadingMessage('Configuring API Key...'); setError(null);
        try {
            await axios.post(`${API_BASE_URL}/configure`, { google_api_key: googleApiKey });
            setIsApiKeySet(true);
        } catch (err) {
            setError('Failed to configure API key.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcessDocs = async (files: FileList | null) => {
        if (!files || files.length === 0) { setError('Please select files.'); return; }
        setIsLoading(true); setLoadingMessage('Processing documents...'); setError(null);
        const formData = new FormData();
        Array.from(files).forEach(file => { formData.append('files', file); });
        try {
            await axios.post(`${API_BASE_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setIsKbReady(true);
            navigate('/candidate');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to process documents.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunAnalysis = async (formData: FormData) => {
        if (!isKbReady) { setError("Please process the Knowledge Base first."); return; }
        setIsLoading(true); setLoadingMessage('The agent crew is analyzing...'); setError(null); setFinalReport(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/analyze`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setFinalReport(response.data.report);
            navigate('/result');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    // NEW FUNCTION: Fetches a specific report and navigates to the result page for viewing/downloading.
    const handleViewReport = async (reportId: string) => {
        setIsLoading(true);
        setLoadingMessage('Loading report...');
        setError(null);
        setFinalReport(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/report/${reportId}`);
            setFinalReport(response.data.full_report);
            navigate('/result');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load the report.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const clearReportAndNavigate = (path: string) => {
        setFinalReport(null);
        setError(null);
        navigate(path);
    }

    const value = {
        googleApiKey, setGoogleApiKey, isApiKeySet, handleConfigureKey,
        isKbReady, handleProcessDocs,
        criticalPenalty, setCriticalPenalty, minorPenalty, setMinorPenalty,
        finalReport, isLoading, loadingMessage, error, handleRunAnalysis,
        handleViewReport, 
        clearReportAndNavigate,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
