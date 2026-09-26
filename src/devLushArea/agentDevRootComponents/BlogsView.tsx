import React, { useState, useEffect } from 'react';
import { BlogPost } from './blogs/types/types';
import { blogPostsData } from './blogs/data';
import { BlogsLayout } from './blogs/components/core/BlogsLayout';
import { BlogList } from './blogs/components/core/BlogList';
import { BlogArticle } from './blogs/components/core/BlogArticle';

const blogPosts: BlogPost[] = blogPostsData as BlogPost[];

interface BlogsViewProps {
    routeByUrl?: boolean;
    onBackToWorkspace?: () => void;
    backToWorkspaceLabel?: string;
}

export const BlogsView: React.FC<BlogsViewProps> = ({
    routeByUrl = true,
    onBackToWorkspace = () => window.location.assign('/'),
    backToWorkspaceLabel = 'Back to GPTX.VIP home',
}) => {
    // 1. Initial State from URL
    const getBlogIdFromUrl = () => {
        if (!routeByUrl) return null;
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        return pathSegments.length > 1 && pathSegments[0] === 'blogs' ? pathSegments[1] : null;
    };

    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(getBlogIdFromUrl());

    // 2. Listen to PopState for browser Back/Forward buttons
    useEffect(() => {
        if (!routeByUrl) return;

        const syncSelectedBlogFromLocation = () => {
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const id = getBlogIdFromUrl();
            const hasInvalidArticleRoute = pathSegments.length > 2 || (id !== null && !blogPosts.some((blog) => blog.id === id));

            if (hasInvalidArticleRoute) {
                window.history.replaceState({}, '', '/blogs');
                setSelectedBlogId(null);
                return;
            }

            setSelectedBlogId(id);
        };

        syncSelectedBlogFromLocation();
        window.addEventListener('popstate', syncSelectedBlogFromLocation);
        return () => window.removeEventListener('popstate', syncSelectedBlogFromLocation);
    }, [routeByUrl]);

    // 3. Push state when user clicks a blog or "back to blogs" button
    const handleSelectBlog = (id: string | null) => {
        if (routeByUrl) {
            if (id) {
                window.history.pushState({ blogArticleEntry: true }, '', `/blogs/${encodeURIComponent(id)}`);
            } else {
                if (window.history.state?.blogArticleEntry === true) {
                    setSelectedBlogId(null);
                    window.history.back();
                    return;
                }
                window.history.replaceState({}, '', '/blogs');
            }
        }
        setSelectedBlogId(id);
    };

    const selectedBlog = blogPosts.find(b => b.id === selectedBlogId);

    return (
        <BlogsLayout>
            {selectedBlog ? (
                <BlogArticle 
                    blog={selectedBlog} 
                    allBlogs={blogPosts}
                    onSelectBlog={handleSelectBlog}
                    onBack={() => handleSelectBlog(null)} 
                />
            ) : (
                <BlogList 
                    blogs={blogPosts} 
                    onSelectBlog={handleSelectBlog} 
                    onBackToWorkspace={onBackToWorkspace}
                    backToWorkspaceLabel={backToWorkspaceLabel}
                />
            )}
        </BlogsLayout>
    );
};
