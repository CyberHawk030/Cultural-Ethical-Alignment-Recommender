import { useAppContext } from '@/context/AppContext';
import CandidateForm from '@/components/CandidateForm';
import ReportDisplay from '@/components/ReportDisplay';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye } from 'lucide-react'; 

interface HistoryItem {
    id: string; 
    name: string;
    date: string;
    score: number;
}

export default function CandidatePage() {
    // Get the new handleViewReport function from context
    const { isLoading, error, analysisResult, handleViewReport } = useAppContext();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    const fetchHistory = async () => {
        setIsHistoryLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/history');
            const formattedHistory = response.data.map((item: any) => ({
                id: String(item.id).trim(),
                name: item.candidate_name,
                date: new Date(item.date).toLocaleDateString(),
                score: item.score,
            }));
            setHistory(formattedHistory);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setIsHistoryLoading(false);
        }
    };
    
    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (analysisResult) {
            fetchHistory();
        }
    }, [analysisResult]);

    return (
        <div className="bg-slate-100 min-h-screen w-screen">
            <header className="bg-white shadow-sm p-4"><h1 className="text-2xl font-bold text-center">🧭 Candidate Alignment Analysis</h1></header>
            <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CandidateForm /> 
                    {error && <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded-md">{error}</div>}
                    {isLoading && <div className="mt-4 p-4 text-center bg-white rounded-lg shadow"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p className="mt-3 text-slate-600">Agents are at work...</p></div>}
                    {analysisResult && !isLoading && <ReportDisplay markdownContent={analysisResult} />}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Analysis History</h2>
                        <div className="space-y-3">
                            {isHistoryLoading ? (
                                <p>Loading history...</p>
                            ) : history.length > 0 ? (
                                history.map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 rounded-md border flex justify-between items-center">
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-slate-500">{item.date}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`font-bold text-lg ${item.score < 50 ? 'text-red-500' : item.score < 75 ? 'text-yellow-500' : 'text-green-500'}`}>{item.score}</span>
                                            {/* UPDATED BUTTON */}
                                            <button 
                                                onClick={() => handleViewReport(item.id)}
                                                className="p-2 rounded-full hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                title="View Report"
                                            >
                                                <Eye className="h-5 w-5 text-slate-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500">No history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
