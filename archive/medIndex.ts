
import { HeartIcon, BeakerIcon, StethoscopeIcon, MicroscopeIcon, DropletsIcon, TestTubeIcon, ActivityIcon, SkullIcon } from '../parentComponents/icons';

export const medLabCourseData = [
  {
    id: 'med-overview',
    title: 'Overview',
    icon: StethoscopeIcon,
    longDescription: 'An introduction to the MedLabs simulation environment. Learn about the tools and methodology used in clinical simulations.',
  },
  {
    id: 'cardiology',
    title: 'Cardiology',
    icon: HeartIcon,
    longDescription: 'Explore the electrical and mechanical functions of the heart, including ECG interpretation and cardiac cycles.',
  },
  {
    id: 'myocardial-infarction',
    title: 'Myocardial Infarction',
    icon: ActivityIcon,
    longDescription: 'Comprehensive guide to heart attacks: from plaque rupture pathophysiology to ECG diagnosis and emergency management.',
  },
  {
    id: 'clinical-chemistry',
    title: 'Clinical Chemistry',
    icon: BeakerIcon,
    longDescription: 'Analyze blood chemistry panels to diagnose metabolic and organ system disorders. Interpret lab values for kidneys, liver, and electrolytes.',
  },
  {
    id: 'clinical-lab',
    title: 'Clinical Laboratory',
    icon: MicroscopeIcon,
    longDescription: 'Examine biological samples including urine and fluids. Master urinalysis interpretation and identify cellular abnormalities.',
  },
  {
    id: 'hematology',
    title: 'Hematology',
    icon: DropletsIcon,
    longDescription: 'Study blood morphology and disorders. Analyze peripheral blood smears to identify anemias and leukemias.',
  },
  {
    id: 'physiology',
    title: 'Physiology',
    icon: ActivityIcon,
    longDescription: 'Understand the mechanisms of living organisms. Explore how organ systems work together to maintain homeostasis.',
  },
  {
    id: 'anatomy',
    title: 'Anatomy',
    icon: StethoscopeIcon, // you can reuse an icon depending on what's available
    longDescription: 'Explore the human body and brain structure in this interactive module. Click on different organs to learn about their function, clinical significance, and anatomical details.',
  },
  {
    id: 'toxicology',
    title: 'Toxicology',
    icon: SkullIcon,
    longDescription: 'Study the adverse effects of chemicals on living organisms. Learn to identify, diagnose, and treat poisonings and drug overdoses.',
  },
  {
    id: 'point-of-care',
    title: 'Point of Care',
    icon: TestTubeIcon,
    longDescription: 'Master rapid diagnostic testing at the bedside. Interpret lateral flow assays for infectious diseases and pregnancy.',
  }
];
