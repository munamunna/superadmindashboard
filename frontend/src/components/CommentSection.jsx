import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CommentSection = ({ pageName }) => {
    const { accessToken, user, permissions: userPermissions } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permissions, setPermissions] = useState({
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false
    });

    // Check permissions whenever pageName or userPermissions change
    useEffect(() => {
        checkPermissions();
    }, [pageName, userPermissions, user]);

    // Fetch comments when permissions are set
    useEffect(() => {
        if (permissions.can_view || user?.is_super_admin) {
            fetchComments();
        }
    }, [permissions.can_view, user?.is_super_admin, pageName]);

    const checkPermissions = () => {
        // Super admins have all permissions
        if (user?.is_super_admin) {
            setPermissions({
                can_view: true,
                can_create: true,
                can_edit: true,
                can_delete: true
            });
            return;
        }

        // Check user permissions for this page from AuthContext
        const userPermission = userPermissions?.find(p => p.page_name === pageName);
        if (userPermission) {
            setPermissions({
                can_view: userPermission.can_view,
                can_create: userPermission.can_create,
                can_edit: userPermission.can_edit,
                can_delete: userPermission.can_delete
            });
        } else {
            // No permissions found for this page
            setPermissions({
                can_view: false,
                can_create: false,
                can_edit: false,
                can_delete: false
            });
        }
    };

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`http://127.0.0.1:8000/api/auth/comments/?page_name=${pageName}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setComments(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axios.post(
                'http://127.0.0.1:8000/api/auth/comments/',
                { page_name: pageName, text: newComment },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create comment');
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editText.trim()) return;

        try {
            const res = await axios.put(
                `http://127.0.0.1:8000/api/auth/comments/${commentId}/`,
                { text: editText },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setComments(comments.map(c => c.id === commentId ? res.data : c));
            setEditingComment(null);
            setEditText('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to edit comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/auth/comments/${commentId}/`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete comment');
        }
    };

    const startEditing = (comment) => {
        setEditingComment(comment.id);
        setEditText(comment.text);
    };

    const cancelEditing = () => {
        setEditingComment(null);
        setEditText('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (!permissions.can_view && !user?.is_super_admin) {
        return (
            <div className="bg-slate-800 p-4 rounded-lg text-white">
                <p className="text-gray-400">You don't have permission to view comments on this page.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg text-white">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            {error && (
                <div className="bg-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Create Comment Form */}
            {permissions.can_create && (
                <form onSubmit={handleCreateComment} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-3 bg-slate-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                    >
                        Post Comment
                    </button>
                </form>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-4">Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-700 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-semibold text-blue-400">{comment.username}</span>
                                    <span className="text-gray-400 text-sm ml-2">{formatDate(comment.created_at)}</span>
                                    {comment.created_at !== comment.updated_at && (
                                        <span className="text-gray-500 text-xs ml-2">(edited)</span>
                                    )}
                                </div>

                                {/* Edit/Delete buttons - only show for own comments or super admin */}
                                {(comment.user === user?.id || user?.is_super_admin) && (
                                    <div className="flex gap-2">
                                        {permissions.can_edit && editingComment !== comment.id && (
                                            <button
                                                onClick={() => startEditing(comment)}
                                                className="text-blue-400 hover:text-blue-300 text-sm"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {permissions.can_delete && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Comment Text or Edit Form */}
                            {editingComment === comment.id ? (
                                <div>
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full p-2 bg-slate-600 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleEditComment(comment.id)}
                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-200 whitespace-pre-wrap">{comment.text}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
