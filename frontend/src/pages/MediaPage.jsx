import React from 'react';
import CommentSection from '../components/CommentSection';

const MediaPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Media Plans</h1>

                <div className="bg-slate-800 p-6 rounded-lg text-white mb-6">
                    <h2 className="text-xl font-semibold mb-4">Media Management</h2>
                    <p className="text-gray-300">
                        Manage media assets, plan campaigns, and organize content.
                    </p>
                </div>

                <CommentSection pageName="media" />
            </div>
        </div>
    );
};

export default MediaPage;
