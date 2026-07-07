import { Code2, Terminal, Cpu, Search } from "lucide-react";

export const CODE_CONCEPT_CATEGORIES = [
  { 
    id: "search", 
    label: "Search Topics", 
    icon: Search, 
    title: "Search Knowledge Base", 
    description: "Search topics, categories, and tags seamlessly.",
    theme: "emerald"
  },
  { 
    id: "general", 
    label: "General", 
    icon: Code2, 
    title: "General Programming Concepts", 
    description: "Foundational patterns and architectural systems.",
    theme: "indigo"
  },
  { 
    id: "cpp_hello_world", 
    label: "C++ Hello World", 
    icon: Terminal, 
    title: "C++ Fundamentals", 
    description: "Getting started with C++ syntax and environment setup.",
    theme: "blue"
  },
  { 
    id: "cpp_engine_design", 
    label: "C++ Engine Design", 
    icon: Terminal, 
    title: "C++ Trading Engine Design Basic to Advance", 
    description: "Low-level memory management and fast execution paradigms.",
    theme: "blue"
  },
  { 
    id: "HFT", 
    label: "HFT", 
    icon: Cpu, 
    title: "High-Frequency Trading", 
    description: "Ultra-low latency algorithms and kernel-level optimizations.",
    theme: "emerald"
  },
  { 
    id: "python", 
    label: "Python", 
    icon: Terminal, 
    title: "Python Fundamentals & Advanced", 
    description: "Data analysis, machine learning, and rapid prototyping workflows.",
    theme: "blue"
  }
] as const;

export type CategoryType = typeof CODE_CONCEPT_CATEGORIES[number]["id"];
