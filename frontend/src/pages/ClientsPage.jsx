import React from 'react';
import CommentSection from '../components/CommentSection';

const ClientsPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Clients</h1>

                <div className="bg-slate-800 p-6 rounded-lg text-white mb-6">
                    <h2 className="text-xl font-semibold mb-4">Client Management</h2>
                    <p className="text-gray-300">
                        Manage client relationships, contacts, and communication history.
                    </p>
                </div>

                <CommentSection pageName="clients" />
            </div>
        </div>
    );
};

export default ClientsPage;
