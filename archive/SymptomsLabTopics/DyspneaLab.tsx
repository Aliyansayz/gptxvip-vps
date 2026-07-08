import React from 'react';
import { SymptomDetailTemplate } from './SymptomDetailTemplate';
import symptomsData from './symptoms_detail.json';

const DyspneaLab: React.FC = () => {
  const data = symptomsData.find(s => s.id === 3);
  if (!data) return <div>Data not found</div>;
  return <SymptomDetailTemplate data={data as any} />;
};

export default DyspneaLab;
