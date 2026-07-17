import re
import os

source_file = 'src/devLushArea/devLushComponents/devLushTopicsView/DevLushTheoryVisual.tsx'

with open(source_file, 'r') as f:
    content = f.read()

components = [
    {
        "name": "PerceptionLoopVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 1. Perception-Reasoning-Action Loops",
        "search_end": "    // 2. Prompt Injection Containment",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';\nimport { Radio } from 'lucide-react';"
    },
    {
        "name": "OrchestratorVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 3. Multi-Agent / Orchestrator",
        "search_end": "    // 3b. Handoffs",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "HandoffsVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 3b. Handoffs",
        "search_end": "    // 3c. Specialist Teams / Worker",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "SpecialistTeamsVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 3c. Specialist Teams / Worker",
        "search_end": "    // 3. Multi-Agent / Orchestrator\n    if (has('reconnaissance')",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "ReactPatternVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 7. ReAct Pattern / Thought-Action-Observation",
        "search_end": "    // 8. Evaluator-Optimizer",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "EvaluatorOptimizerVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 8. Evaluator-Optimizer",
        "search_end": "    // 9. Sequential Chaining",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "SequentialChainingVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 9. Sequential Chaining",
        "search_end": "    // 10. Parallel Fanout",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "ParallelFanoutVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 10. Parallel Fanout",
        "search_end": "    // 11. Human-in-the-Loop",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "HumanInTheLoopVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 11. Human-in-the-Loop",
        "search_end": "    // 12. Memory Architectures / RAG",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "MemoryArchitecturesVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentMemories/visuals",
        "search_start": "    // 12. Memory Architectures / RAG",
        "search_end": "    // 13. Single Agent (Fallback)",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    },
    {
        "name": "SingleAgentVisual",
        "dir": "src/devLushArea/devLushComponents/devLushTopics/agentTypes/visuals",
        "search_start": "    // 13. Single Agent (Fallback)",
        "search_end": "    // Legal: Tax Compliance Agents",
        "imports": "import React from 'react';\nimport { motion } from 'motion/react';"
    }
]

import_statements_types = []
import_statements_memories = []

for comp in components:
    start_idx = content.find(comp['search_start'])
    end_idx = content.find(comp['search_end'], start_idx)
    
    if start_idx == -1 or end_idx == -1:
        print(f"Could not find block for {comp['name']}")
        continue
        
    block = content[start_idx:end_idx]
    
    # Extract the return statement block
    return_match = re.search(r'(return \([\s\S]*?\n        \);)', block)
    if not return_match:
        print(f"Could not find return block in {comp['name']}")
        continue
        
    original_return = return_match.group(1)
    
    # Create the new component code
    new_comp_code = f"{comp['imports']}\n\nexport const {comp['name']}: React.FC<{{ analogyName?: string }}> = ({{ analogyName }}) => {{\n    {original_return}\n}};\n"
    
    # Write to file
    os.makedirs(comp['dir'], exist_ok=True)
    with open(os.path.join(comp['dir'], f"{comp['name']}.tsx"), 'w') as f:
        f.write(new_comp_code)
        
    # Replace in original content
    if comp['name'] == 'PerceptionLoopVisual':
        new_return = f"return <{comp['name']} />;"
    else:
        new_return = f"return <{comp['name']} analogyName={{analogyName}} />;"
    content = content.replace(original_return, new_return)
    
    # Add to index.ts and imports
    if 'agentTypes' in comp['dir']:
        import_statements_types.append(comp['name'])
        with open(os.path.join(comp['dir'], 'index.ts'), 'a') as f:
            f.write(f"export * from './{comp['name']}';\n")
    else:
        import_statements_memories.append(comp['name'])
        with open(os.path.join(comp['dir'], 'index.ts'), 'a') as f:
            f.write(f"export * from './{comp['name']}';\n")

# Add imports to DevLushTheoryVisual.tsx
import_str = ""
if import_statements_types:
    import_str += f"import {{\n    {',\\n    '.join(import_statements_types)}\n}} from '../devLushTopics/agentTypes/visuals';\n"
if import_statements_memories:
    import_str += f"import {{\n    {',\\n    '.join(import_statements_memories)}\n}} from '../devLushTopics/agentMemories/visuals';\n"

# Insert imports after the last import in the file
import_end_idx = content.find("} from '../devLushTopics/system-design/visuals';\n")
if import_end_idx != -1:
    insert_idx = import_end_idx + len("} from '../devLushTopics/system-design/visuals';\n")
    content = content[:insert_idx] + import_str + content[insert_idx:]
else:
    print("Could not find import insertion point")

with open(source_file, 'w') as f:
    f.write(content)

print("Done extracting and replacing components!")
