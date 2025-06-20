import { useAppContext } from '@/context/AppContext';
import { KeyRound, Cog, Library, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ConfigForm() {
    // NOTE: You will need to update AppContext to match these changes
    const {
        googleApiKey, setGoogleApiKey, isApiKeySet, handleConfigureKey,
        criticalPenalty, setCriticalPenalty, minorPenalty, setMinorPenalty,
        handleProcessDocs, isKbReady, // Simplified state
        isLoading, error
    } = useAppContext();
    
    // Simplified to one state for files
    const [knowledgeFiles, setKnowledgeFiles] = useState<FileList | null>(null);

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
            {error && <div className="p-3 bg-red-100 text-red-700 border border-red-200 rounded-md">{error}</div>}

            {/* API Key */}
            <div className={`p-4 rounded-lg border transition-all ${isApiKeySet ? 'border-green-300 bg-green-50' : 'border-slate-200'}`}>
                <h3 className="font-semibold text-lg flex items-center mb-3">
                    <KeyRound size={20} className="mr-2"/> 1. API Key
                    {isApiKeySet && <CheckCircle2 size={20} className="ml-auto text-green-500"/>}
                </h3>
                <input type="password" placeholder="Enter Google AI Studio API Key" value={googleApiKey} onChange={(e) => setGoogleApiKey(e.target.value)} className="w-full p-2 border rounded-md" disabled={isApiKeySet || isLoading} />
                {!isApiKeySet && <button onClick={handleConfigureKey} disabled={isLoading} className="w-full mt-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400">Configure</button>}
            </div>

            {/* Scoring */}
            <div className="p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg flex items-center mb-3"><Cog size={20} className="mr-2"/> 2. Scoring</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Critical Penalty</label><input type="number" value={criticalPenalty} onChange={e => setCriticalPenalty(parseInt(e.target.value))} className="w-full p-2 border rounded-md"/></div>
                    <div><label className="block text-sm font-medium">Minor Penalty</label><input type="number" value={minorPenalty} onChange={e => setMinorPenalty(parseInt(e.target.value))} className="w-full p-2 border rounded-md"/></div>
                </div>
            </div>

            {/* SIMPLIFIED: Single Knowledge Base */}
            <div className={`p-4 rounded-lg border transition-all ${isKbReady ? 'border-green-300 bg-green-50' : 'border-slate-200'}`}>
                <h3 className="font-semibold text-lg flex items-center mb-3">
                    <Library size={20} className="mr-2"/> 3. Knowledge Base
                    {isKbReady && <CheckCircle2 size={20} className="ml-auto text-green-500"/>}
                </h3>
                <p className="text-sm text-slate-600 mb-3">Upload documents containing institutional policies, ethical guidelines, or any other relevant context.</p>
                <input type="file" multiple onChange={(e) => setKnowledgeFiles(e.target.files)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100" disabled={!isApiKeySet || isLoading}/>
                <button 
                    onClick={() => handleProcessDocs(knowledgeFiles)} 
                    disabled={!isApiKeySet || isLoading || !knowledgeFiles} 
                    className="w-full mt-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400"
                >
                    Process Documents
                </button>
            </div>
        </div>
    );
}