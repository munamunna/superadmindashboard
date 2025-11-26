import React from 'react';
import CommentSection from '../components/CommentSection';

const FinancePage = () => {
    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Finance & Accounting</h1>

                <div className="bg-slate-800 p-6 rounded-lg text-white mb-6">
                    <h2 className="text-xl font-semibold mb-4">Finance Management</h2>
                    <p className="text-gray-300">
                        Manage financial records, accounting, budgets, and reports.
                    </p>
                </div>

                <CommentSection pageName="finance" />
            </div>
        </div>
    );
};

export default FinancePage;
