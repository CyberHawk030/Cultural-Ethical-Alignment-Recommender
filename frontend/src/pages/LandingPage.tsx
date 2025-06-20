import { useNavigate } from 'react-router-dom';
import { BrainCircuit, FileText, ShieldCheck, BarChart2, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const features = [
    { icon: <BrainCircuit size={32} className="text-blue-500" />, title: "Agentic AI Workflow", description: "Utilizes a multi-agent crew where each AI performs a specialized task, from profiling to analysis." },
    { icon: <FileText size={32} className="text-blue-500" />, title: "RAG-Enabled Analysis", description: "Goes beyond basic text analysis by using Retrieval-Augmented Generation to query your specific institutional documents." },
    { icon: <ShieldCheck size={32} className="text-blue-500" />, title: "Ethical Alignment", description: "Identifies nuanced conflicts and alignments between a candidate's values and your organization's core principles." },
    { icon: <BarChart2 size={32} className="text-blue-500" />, title: "Quantitative Scoring", description: "Generates a configurable alignment score, providing a clear, data-driven metric for hiring decisions." },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans">
      <header className="absolute top-0 left-0 right-0 p-4 bg-transparent z-10"><div className="container mx-auto flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-900">🧭 Ethical Compass</h1><button onClick={() => navigate('/config')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Launch App</button></div></header>
      <main>
        <section className="relative h-screen flex items-center justify-center bg-white"><div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div><div className="container mx-auto text-center relative px-4"><h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">Hire for Culture, Not Just Skill.</h2><p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">The Ethical Compass is an advanced AI system that analyzes candidate materials against your unique institutional values, ensuring your next hire is a perfect cultural fit.</p><button onClick={() => navigate('/config')} className="mt-8 bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-transform hover:scale-105">Start Your Analysis <ChevronRight className="inline-block" /></button></div></section>
        <section id="features" className="py-20 bg-slate-100"><div className="container mx-auto px-4"><div className="text-center mb-12"><p className="text-blue-600 font-semibold">FEATURES</p><h3 className="text-4xl font-bold text-slate-900">Why The Ethical Compass?</h3><p className="mt-4 text-slate-600 max-w-2xl mx-auto">Our agentic system provides insights that go far beyond what a human can find in a traditional resume review.</p></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{features.map((feature, index) => (<div key={index} className="bg-white p-6 rounded-lg shadow-md border border-slate-200"><div className="mb-4">{feature.icon}</div><h4 className="text-xl font-bold text-slate-900">{feature.title}</h4><p className="mt-2 text-slate-600">{feature.description}</p></div>))}</div></div></section>
      </main>
      <footer className="bg-slate-900 text-slate-300 py-8"><div className="container mx-auto text-center"><p>&copy; 2025 Ethical Compass. All rights reserved.</p></div></footer>
    </div>
  );
}