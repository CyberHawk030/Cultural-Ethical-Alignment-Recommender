import { useAppContext } from '@/context/AppContext';
import ConfigForm from '@/components/ConfigForm';
import { useNavigate } from 'react-router-dom';

export default function ConfigPage() {
    const { isApiKeySet, isInstKbReady, isLoading } = useAppContext();
    const navigate = useNavigate();

    return (
        <div className="bg-slate-100 min-h-screen w-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">🧭 Ethical Compass</h1>
            <h2 className="text-2xl text-slate-600 mb-8">Application Configuration</h2>
            <div className="w-full max-w-2xl">
                <ConfigForm />
            </div>
            {isApiKeySet && isInstKbReady && !isLoading && (
                 <button 
                    onClick={() => navigate('/candidate')} 
                    className="mt-8 bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-700 transition-transform hover:scale-105"
                 >
                    Proceed to Candidate Analysis →
                 </button>
            )}
        </div>
    );
}