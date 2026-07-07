import React from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircleIcon, Database, Terminal, GitMerge, Search } from 'lucide-react';

export const RecommendationSemanticMemoryActivity: React.FC<{ 
  exercises: Exercise[]; 
  step: number;
  onComplete: () => void; 
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Semantic Memory lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'Semantic Memory in Recommendation'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Vector database implementation for product search.'}</p>
            </div>
            
            <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-card-foreground flex items-center mb-4">
                        <Database className="w-5 h-5 text-indigo-500 mr-2"/>
                        1. Data Ingestion & Embedding Generation
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Before a user can search, the system converts unstructured product catalog data into dense vector math.
                    </p>
                    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm overflow-x-auto space-y-4">
                        <div className="text-slate-400">[Unstructured Product Data]</div>
                        <div className="text-emerald-400">"Midnight Black waterproof running shoes with responsive foam cushioning."</div>
                        <div className="flex justify-center text-slate-600">│<br/>▼</div>
                        <div className="text-center text-blue-400 border border-slate-700 p-2 rounded">[Text Embedding Model (e.g., text-embedding-3)]</div>
                        <div className="flex justify-center text-slate-600">│<br/>▼</div>
                        <div className="text-slate-400">[High-Dimensional Vector Array]</div>
                        <div className="text-purple-400">[-0.0124, 0.0843, -0.4121, ..., 0.0056] <span className="text-slate-500">(1,536 floating-point numbers)</span></div>
                        <div className="flex justify-center text-slate-600">│<br/>▼</div>
                        <div className="text-center text-indigo-400 border border-slate-700 p-2 rounded">
                            <div>[Stored in Vector Database]</div>
                            <div className="text-xs text-slate-400 mt-1">(ID: prod_994, Metadata: {'{'}price: 120, brand: "RunMax"{'}'})</div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-card-foreground flex items-center mb-4">
                        <Search className="w-5 h-5 text-emerald-500 mr-2"/>
                        2. Querying (Semantic Match Execution)
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        A user enters a conversational search query. The database uses vector math to find the closest conceptual match, even if the exact keywords do not match.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li><strong>User Query:</strong> "Sneakers for rainy day jogging"</li>
                        <li><strong>Step 1: Vectorization:</strong> Converts the query into a temporary vector.</li>
                        <li><strong>Step 2: Distance Calculation:</strong> Computes distance (e.g., Cosine Similarity) between query vector and stored vectors.</li>
                    </ul>
                    
                    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm overflow-x-auto text-center space-y-4">
                        <div><span className="text-slate-400">Query Vector:</span> <span className="text-purple-400">[ 0.0152,  0.0711, -0.3988, ... ]</span></div>
                        <div className="text-slate-600">│<br/>┌───────────────┼───────────────┐<br/>▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="p-2 border border-emerald-900/50 bg-emerald-900/20 rounded">
                                <div className="font-bold text-emerald-400">Product A: [0.0148,...]</div>
                                <div className="text-slate-400 mt-1">(prod_994: Waterproof Shoes)</div>
                                <div className="text-emerald-300 mt-2 font-bold">Similarity: 0.94</div>
                            </div>
                            <div className="p-2 border border-slate-700 bg-slate-800 rounded">
                                <div className="font-bold text-blue-400">Product B: [-0.0912,...]</div>
                                <div className="text-slate-400 mt-1">(prod_112: Canvas Slip-ons)</div>
                                <div className="text-slate-300 mt-2">Similarity: 0.41</div>
                            </div>
                            <div className="p-2 border border-slate-700 bg-slate-800 rounded">
                                <div className="font-bold text-red-400">Product C: [0.8123,...]</div>
                                <div className="text-slate-400 mt-1">(prod_450: Leather Boots)</div>
                                <div className="text-slate-300 mt-2">Similarity: 0.12</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-card-foreground flex items-center mb-4">
                        <GitMerge className="w-5 h-5 text-orange-500 mr-2"/>
                        3. Metadata Filtering (HNSW Indexing)
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        To make searches fast and relevant, production vector databases use Hierarchical Navigable Small World (HNSW) graphs to narrow down the search space combined with hard metadata filters.
                    </p>
                    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm overflow-x-auto text-center space-y-3">
                        <div className="text-blue-400">[All Vector Points]</div>
                        <div className="text-slate-600">│<br/>(Filter Applied)</div>
                        <div className="text-orange-400 border border-orange-900/50 p-2 rounded inline-block bg-orange-900/20">"Only show products {'<'} $150"</div>
                        <div className="text-slate-600">│<br/>▼</div>
                        <div className="text-blue-300">[Filtered Sub-Set of Vector Space]</div>
                        <div className="text-slate-600">│<br/>(Approximate Nearest Neighbor Search)<br/>▼</div>
                        <div className="text-emerald-400 font-bold">[Top K Most Similar Results Returned]</div>
                        <div className="text-left max-w-md mx-auto space-y-1 mt-2">
                            <div className="bg-slate-800 p-2 rounded border border-slate-700">1. <span className="text-emerald-300">prod_994</span> (Waterproof Running Shoes) - <span className="text-emerald-400 font-bold">Match: 94%</span></div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-700">2. <span className="text-emerald-300">prod_301</span> (All-Weather Trail Runners) - <span className="text-emerald-400 font-bold">Match: 88%</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-card-foreground flex items-center mb-4">
                        <Terminal className="w-5 h-5 text-blue-500 mr-2"/>
                        4. Code Implementation (Python Example)
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        This is a standard implementation example using a vector database client (such as ChromaDB, Pinecone, or Qdrant) to query data with metadata filtering.
                    </p>
                    <div className="bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl font-mono text-sm overflow-x-auto">
<pre><code><span className="text-[#ff7b72]">import</span> chromadb

<span className="text-[#8b949e]"># Initialize the vector database client</span>
client = chromadb.Client()
collection = client.get_collection(name=<span className="text-[#a5d6ff]">"product_catalog"</span>)

<span className="text-[#8b949e]"># Execute a semantic search query</span>
results = collection.query(
    query_texts=[<span className="text-[#a5d6ff]">"Sneakers for rainy day jogging"</span>],
    n_results=<span className="text-[#79c0ff]">2</span>,
    where={"{"}<span className="text-[#a5d6ff]">"price"</span>: {"{"}<span className="text-[#a5d6ff]">"$lt"</span>: <span className="text-[#79c0ff]">150</span>{"}}"}{"}"}  <span className="text-[#8b949e]"># Metadata filter</span>
)

<span className="text-[#8b949e]"># Output structural payload returned to the application</span>
<span className="text-[#d2a8ff]">print</span>(results)</code></pre>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mt-6 mb-2">Returned Payload Structure:</h3>
                    <div className="bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl font-mono text-sm overflow-x-auto">
<pre><code>{`{
  "ids": [["prod_994", "prod_301"]],
  "distances": [[0.06, 0.12]], 
  "metadatas": [[
    {"brand": "RunMax", "price": 120, "name": "Midnight Black Waterproof Runner"},
    {"brand": "TrailGrip", "price": 145, "name": "All-Weather Apex Trail Shoe"}
  ]]
}`}</code></pre>
                    </div>
                </div>

            </div>
            
            <div className="p-4 text-center">
                 <button onClick={handleComplete} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 inline-flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5"/>
                    Mark as Reviewed
                </button>
            </div>
        </div>
    );
};

export default RecommendationSemanticMemoryActivity;
