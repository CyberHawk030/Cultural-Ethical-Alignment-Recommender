// components/ReportDisplay.tsx

import ReactMarkdown from 'react-markdown';

interface ReportDisplayProps {
    markdownContent: string;
}

export default function ReportDisplay({ markdownContent }: ReportDisplayProps) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Analysis Report</h2>
            <article className="prose prose-slate max-w-none prose-table:w-full prose-th:text-left prose-p:my-2 prose-headings:my-4">
                <ReactMarkdown>
                    {markdownContent}
                </ReactMarkdown>
            </article>
        </div>
    );
}