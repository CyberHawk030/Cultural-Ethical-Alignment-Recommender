import { useAppContext } from '@/context/AppContext';
import ReportDisplay from '@/components/ReportDisplay';
import { Download, FilePlus2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

export default function ResultPage() {
    const { finalReport, clearReportAndNavigate } = useAppContext();
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = reportRef.current;
        if (!input) return;

        html2canvas(input, { 
            scale: 2, 
            backgroundColor: '#ffffff',
            onclone: (document) => {
                const clonedEl = document.getElementById(input.id);
                if (clonedEl) {
                    clonedEl.style.padding = '15px';
                }
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
                position = -heightLeft;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            
            pdf.save("alignment-report.pdf");
        });
    };
    
    if (!finalReport) {
        return (
            <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-100 p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">No Report Found</h2>
                    <p className="text-slate-600 mt-2">The analysis may not have been run or completed successfully.</p>
                    <button onClick={() => clearReportAndNavigate('/candidate')} className="mt-6 p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                        Start a New Analysis
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-100 min-h-screen w-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Analysis Complete</h1>
                    <div className="flex space-x-2">
                        <button onClick={handleDownloadPdf} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center"><Download size={18} className="mr-2"/>Download PDF</button>
                        <button onClick={() => clearReportAndNavigate('/candidate')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"><FilePlus2 size={18} className="mr-2"/>Analyze Another</button>
                    </div>
                </div>
                <div id="report-to-download" ref={reportRef}>
                    <ReportDisplay markdownContent={finalReport} />
                </div>
            </div>
        </div>
    );
}
