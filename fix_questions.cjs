const fs = require('fs');

const files = [
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/accounting/BenfordsLawAudit.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/accounting/SemanticReconciliation.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/cybersecurity/AutonomousReconActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/cybersecurity/SecOpsActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/cybersecurity/SecurityToolsSimulators.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/devtools/DevToolsActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/ecommerce/AgentSyncPythonActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/ecommerce/AgentSyncTypescriptActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/ecommerce/GenericAgentActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/ecommerce/MultiAgentCheckoutFlow.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/healthcare/HealthcareActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/helpdesk/HelpdeskActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/legal/LegalAgentsActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/legal/LegalIpProtectionActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/legal/LegalLiabilityCapActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/legal/LegalMnaDueDiligenceActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/legal/LegalTaxComplianceActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/recommendation/ExpenseTrackingActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/recommendation/ExpenseTrackingTSActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/recommendation/RecommendationActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/supplychain/SupplyChainInventoryActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/supplychain/SupplyChainRoutePlanningActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/supplychain/SupplyChainSupplierRiskActivity.tsx',
  '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/supplychain/SupplyChainWarehouseOrchestrationActivity.tsx'
];

let updatedCount = 0;

const insertText = `      {question?.question && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {question.question}
        </h4>
      )}\n`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('question?.options?.map') || content.includes('question.options?.map') || content.includes('question.options.map')) {
    // We look for the div with grid-cols-1 that contains the options mapping
    // Usually it looks like: <div className="grid grid-cols-1 gap-3">\n    {question.options
    
    // Create a regular expression to find that div and insert the header above it
    const regex = /(<div className="grid grid-cols-1 gap-3">\s*\{question\.?options\.?\??\.map)/g;
    
    if (regex.test(content)) {
      content = content.replace(regex, insertText + '$1');
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
      console.log(`Updated ${file}`);
    } else {
      console.log(`Could not find match in ${file}`);
    }
  }
});

console.log(`Total updated: ${updatedCount}`);
