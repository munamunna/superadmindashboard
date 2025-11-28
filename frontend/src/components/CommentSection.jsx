import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { commentApi } from '../services/commentService';

const CommentSection = ({ pageName }) => {
    const { accessToken, user, permissions: userPermissions } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
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

    const checkPermissions = () => {
        console.log('🔍 CommentSection - Checking permissions for page:', pageName);
        console.log('👤 User:', user);
        console.log('🔑 User Permissions from Context:', userPermissions);

        // Super admins have all permissions
        if (user?.is_super_admin) {
            console.log('✅ User is super admin - granting all permissions');
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
        console.log('🔎 Found permission for this page:', userPermission);

        if (userPermission) {
            console.log('✅ Setting permissions:', {
                can_view: userPermission.can_view,
                can_create: userPermission.can_create,
                can_edit: userPermission.can_edit,
                can_delete: userPermission.can_delete
            });
            setPermissions({
                can_view: userPermission.can_view,
                can_create: userPermission.can_create,
                can_edit: userPermission.can_edit,
                can_delete: userPermission.can_delete
            });
        } else {
            console.log('❌ No permissions found for this page - denying access');
            setPermissions({
                can_view: false,
                can_create: false,
                can_edit: false,
                can_delete: false
            });
        }
    };

    // ==================== REACT QUERY HOOKS ====================

    // Fetch comments using React Query
    const {
        data: comments = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['comments', pageName],
        queryFn: () => commentApi.getComments(pageName, accessToken),
        enabled: (permissions.can_view || user?.is_super_admin) && !!accessToken,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Create comment mutation
    const createCommentMutation = useMutation({
        mutationFn: (text) => commentApi.createComment({ pageName, text, accessToken }),
        onSuccess: (newComment) => {
            // Optimistic update: add new comment to the list
            queryClient.setQueryData(['comments', pageName], (oldComments) => [
                newComment,
                ...(oldComments || [])
            ]);
            setNewComment('');
            console.log('✅ Comment created successfully');
        },
        onError: (error) => {
            console.error('❌ Failed to create comment:', error);
        }
    });

    // Update comment mutation
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, text }) =>
            commentApi.updateComment({ commentId, text, accessToken }),
        onSuccess: (updatedComment) => {
            // Optimistic update: update the comment in the list
            queryClient.setQueryData(['comments', pageName], (oldComments) =>
                oldComments?.map(c => c.id === updatedComment.id ? updatedComment : c) || []
            );
            setEditingComment(null);
            setEditText('');
            console.log('✅ Comment updated successfully');
        },
        onError: (error) => {
            console.error('❌ Failed to update comment:', error);
        }
    });

    // Delete comment mutation
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => commentApi.deleteComment({ commentId, accessToken }),
        onSuccess: (deletedCommentId) => {
            // Optimistic update: remove comment from the list
            queryClient.setQueryData(['comments', pageName], (oldComments) =>
                oldComments?.filter(c => c.id !== deletedCommentId) || []
            );
            console.log('✅ Comment deleted successfully');
        },
        onError: (error) => {
            console.error('❌ Failed to delete comment:', error);
        }
    });

    // ==================== EVENT HANDLERS ====================

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        createCommentMutation.mutate(newComment);
    };

    const handleEditComment = async (commentId) => {
        if (!editText.trim()) return;
        updateCommentMutation.mutate({ commentId, text: editText });
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        deleteCommentMutation.mutate(commentId);
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

    // ==================== RENDER ====================

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

            {/* Error Display */}
            {(error || createCommentMutation.error || updateCommentMutation.error || deleteCommentMutation.error) && (
                <div className="bg-red-600 p-3 rounded mb-4">
                    {error?.response?.data?.error ||
                        createCommentMutation.error?.response?.data?.error ||
                        updateCommentMutation.error?.response?.data?.error ||
                        deleteCommentMutation.error?.response?.data?.error ||
                        'An error occurred'}
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
                        disabled={createCommentMutation.isPending}
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={createCommentMutation.isPending || !newComment.trim()}
                    >
                        {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className="mt-2">Loading comments...</p>
                </div>
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
                                                disabled={updateCommentMutation.isPending}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {permissions.can_delete && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                                                disabled={deleteCommentMutation.isPending}
                                            >
                                                {deleteCommentMutation.isPending ? 'Deleting...' : 'Delete'}
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
                                        disabled={updateCommentMutation.isPending}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleEditComment(comment.id)}
                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                                            disabled={updateCommentMutation.isPending || !editText.trim()}
                                        >
                                            {updateCommentMutation.isPending ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                                            disabled={updateCommentMutation.isPending}
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
