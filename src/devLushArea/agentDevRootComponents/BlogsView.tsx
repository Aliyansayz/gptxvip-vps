import React, { useState, useEffect } from 'react';
import { BlogPost } from './blogs/types/types';
import { blogPostsData } from './blogs/data';
import { BlogsLayout } from './blogs/components/core/BlogsLayout';
import { BlogList } from './blogs/components/core/BlogList';
import { BlogArticle } from './blogs/components/core/BlogArticle';

const blogPosts: BlogPost[] = blogPostsData as BlogPost[];

export const BlogsView: React.FC = () => {
    // 1. Initial State from URL
    const getBlogIdFromUrl = () => {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        return pathSegments.length > 1 && pathSegments[0] === 'blogs' ? pathSegments[1] : null;
    };

    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(getBlogIdFromUrl());

    // 2. Listen to PopState for browser Back/Forward buttons
    useEffect(() => {
        const handlePopState = () => {
            setSelectedBlogId(getBlogIdFromUrl());
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // 3. Push state when user clicks a blog or "back to blogs" button
    const handleSelectBlog = (id: string | null) => {
        if (id) {
            window.history.pushState({}, '', `/blogs/${id}`);
        } else {
            window.history.pushState({}, '', '/blogs');
        }
        setSelectedBlogId(id);
    };

    const selectedBlog = blogPosts.find(b => b.id === selectedBlogId);

    return (
        <BlogsLayout>
            {selectedBlog ? (
                <BlogArticle 
                    blog={selectedBlog} 
                    onBack={() => handleSelectBlog(null)} 
                />
            ) : (
                <BlogList 
                    blogs={blogPosts} 
                    onSelectBlog={handleSelectBlog} 
                    onBackToWorkspace={() => window.location.assign('/')}
                />
            )}
        </BlogsLayout>
    );
};
