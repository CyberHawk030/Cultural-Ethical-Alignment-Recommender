import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function CandidateForm() {
    const { handleRunAnalysis, isLoading, criticalPenalty, minorPenalty } = useAppContext();
    
    const [candidateName, setCandidateName] = useState('Dr. Evelyn Reed');
    const [candidateText, setCandidateText] = useState('');
    const [candidateFiles, setCandidateFiles] = useState<FileList | null>(null);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('candidate_name', candidateName);
        formData.append('candidate_written_submissions', candidateText);
        formData.append('critical_penalty', criticalPenalty.toString());
        formData.append('minor_penalty', minorPenalty.toString());
        if (candidateFiles) {
            Array.from(candidateFiles).forEach(file => {
                formData.append('candidate_files', file);
            });
        }
        handleRunAnalysis(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Submit Candidate for Analysis</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Candidate Name</label>
                    <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Paste Written Statements</label>
                    <textarea value={candidateText} onChange={(e) => setCandidateText(e.target.value)} className="w-full p-2 border rounded-md h-32" placeholder="Paste cover letter, interview answers, etc."/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Upload Resume/CV</label>
                    <input type="file" multiple onChange={(e) => setCandidateFiles(e.target.files)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100" />
                </div>
            </div>
            <button type="submit" disabled={isLoading} className="mt-6 w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors">
                {isLoading ? 'Analyzing...' : 'Run Alignment Analysis'}
            </button>
        </form>
    );
}