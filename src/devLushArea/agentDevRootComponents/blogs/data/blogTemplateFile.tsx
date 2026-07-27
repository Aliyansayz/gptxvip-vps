import { BlogPost } from '../types/types';

export const BlogTemplate: BlogPost = {
    id: 'blog-template-best-practices',
    title: 'Blog Architecture & Content Best Practices',
    category: 'Architecture',
    date: new Date().toISOString().split('T')[0],
    summary: 'A comprehensive template demonstrating the hierarchical heading structure and best practices for devLush blogs.',
    estimated_read_time: '4 min read',
    author: {
        name: 'devLush Editor',
        role: 'Content Strategist'
    },
    body: [
        {
            type: 'main_heading',
            text: 'Blog Architecture & Content Best Practices'
        },
        {
            type: 'paragraph',
            elements: [
                { text: 'This document outlines suggestions, architectural best practices, and content strategies for scaling the devLush blogs feature.', style: 'normal' }
            ]
        },
        {
            type: 'heading',
            text: '1. Architectural Improvements'
        },
        {
            type: 'paragraph',
            elements: [
                { text: 'To build a highly scalable, interactive, and visually stunning blog platform, you should break the current BlogsView into specialized, isolated components.', style: 'normal' }
            ]
        },
        {
            type: 'sub_heading',
            text: 'Folder Isolation Practices'
        },
        {
            type: 'list',
            items: [
                'Data Layer: Keep all JSON blog payloads strictly in /blogs/data/.',
                'Components: House all UI components in /blogs/components/.'
            ]
        },
        {
            type: 'sub_heading',
            text: 'Recommended Component Structure'
        },
        {
            type: 'paragraph',
            elements: [
                { text: 'Use specific files like BlogsLayout, BlogList, and BlogArticle to keep concerns separated.', style: 'normal' }
            ]
        },
        {
            type: 'heading',
            text: '2. Content Core & Resolving Pain Points'
        },
        {
            type: 'sub_heading',
            text: 'The Pain Point'
        },
        {
            type: 'paragraph',
            elements: [
                { text: 'The primary pain point in highly technical blogs is cognitive overload. Address this with hyper-contextual formatting.', style: 'normal' }
            ]
        }
    ]
};
