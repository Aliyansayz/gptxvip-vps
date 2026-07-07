import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CppCodeSnippetProps {
  code: string;
  isDarkMode?: boolean;
  inline?: boolean;
  language?: string;
}

export const CppCodeSnippet: React.FC<CppCodeSnippetProps> = ({ 
  code, 
  isDarkMode = true, 
  inline = false,
  language = "cpp"
}) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={isDarkMode ? vscDarkPlus : prism}
      PreTag={inline ? 'span' : 'pre'}
      CodeTag={inline ? 'span' : 'code'}
      customStyle={{
        background: 'transparent',
        padding: 0,
        margin: 0,
        fontSize: 'inherit',
        lineHeight: 'inherit',
        display: inline ? 'inline-block' : 'block',
        minHeight: inline ? '1.5em' : 'auto'
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};
