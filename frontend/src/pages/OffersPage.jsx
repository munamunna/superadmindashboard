import React from 'react';
import CommentSection from '../components/CommentSection';

const OffersPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Offer Pricing SKUs</h1>

                <div className="bg-slate-800 p-6 rounded-lg text-white mb-6">
                    <h2 className="text-xl font-semibold mb-4">Offers Management</h2>
                    <p className="text-gray-300">
                        Create and manage special offers, pricing strategies, and SKU configurations.
                    </p>
                </div>

                <CommentSection pageName="offers" />
            </div>
        </div>
    );
};

export default OffersPage;
