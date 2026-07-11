import React from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircleIcon, Tag, Search, ShoppingCart } from 'lucide-react';

export const SimilarProductsOnDiscountActivity: React.FC<{
    exercises: Exercise[];
    step: number;
    onComplete: () => void;
}> = ({ exercises, step, onComplete }) => {
    const exercise = exercises[step] || exercises[0];

    const handleComplete = () => {
        toast.success("Similar Products On Discount lab marked as complete!");
        onComplete();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{exercise?.title || 'Similar Products On Discount Agent'}</h2>
                <p className="text-muted-foreground mt-2">{exercise?.prompt || 'Explore how to build an agent that recommends similar discounted items.'}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center mb-4">
                    <Tag className="w-6 h-6 text-rose-500" />
                    <span className="ml-3">Concept Overview</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        This specialized recommendation agent identifies the product a user is currently viewing, then uses semantic search to find similar items that are actively on sale or discounted.
                    </p>
                    <div className="bg-rose-500/5 p-4 border border-rose-500/20 rounded-lg">
                        <h3 className="font-semibold text-rose-600 mb-2 flex items-center"><Search className="w-4 h-4 mr-2" /> How it works</h3>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground text-sm">
                            <li><strong>Step 1:</strong> Extracts the embedding vector for the currently viewed product.</li>
                            <li><strong>Step 2:</strong> Queries the vector database for nearest neighbors (similar products).</li>
                            <li><strong>Step 3:</strong> Applies a metadata filter to the query (e.g., <code>has_discount == true</code> or <code>discount_percentage {'>'} 0</code>).</li>
                            <li><strong>Step 4:</strong> Ranks and surfaces the top discounted alternatives to the user.</li>
                        </ul>
                    </div>

                    <div className="bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl font-mono text-sm overflow-x-auto mt-4">
                        <pre><code><span className="text-[#8b949e]"># Example: Filtering for similar items with a discount</span>
                            results = collection.query(
                            query_embeddings=[current_product_embedding],
                            n_results=<span className="text-[#79c0ff]">3</span>,
                            where={"{"}<span className="text-[#a5d6ff]">"discount_percent"</span>: {"{"}<span className="text-[#a5d6ff]">"$gt"</span>: <span className="text-[#79c0ff]">0</span>{"}}"}{"}"}  <span className="text-[#8b949e]"># Hard filter</span>
                            )</code></pre>
                    </div>
                </div>
            </div>

            <div className="p-4 text-center">
                <button onClick={handleComplete} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 inline-flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Mark as Reviewed
                </button>
            </div>
        </div>
    );
};

export default SimilarProductsOnDiscountActivity;
