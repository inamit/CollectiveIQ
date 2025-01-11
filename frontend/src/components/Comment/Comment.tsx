import React, { useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import './Comment.css';
const Comment = ({ username, text, time }) => {
    return (
        <div className="comment-container">
            <div className="comment-header">
                <img
                    className="comment-avatar"
                    src="https://via.placeholder.com/40"
                    alt="User Avatar"
                />
                <div className="comment-details">
                    <h4 className="comment-username">{username}</h4>
                    <p className="comment-time">{time}</p>
                </div>
            </div>
            <p className="comment-text">{text}</p>
        </div>
    );
};

const CommentSection = ({ comments, addComment }) => {
    const [commentText, setCommentText] = useState('');

    const handleAddComment = () => {
        if (commentText.trim()) {
            const newComment = { username: 'John Doe', text: commentText, time: 'Just now' };
            addComment(newComment);
            setCommentText('');
        }
    };

    return (
        <div className="comment-section">
            <div className="add-comment">
        <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
        />
                <button onClick={handleAddComment}>
                    <FaRegComment /> Add Comment
                </button>
            </div>
            <div className="comments-list">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <Comment
                            key={index}
                            username={comment.username}
                            text={comment.text}
                            time={comment.time}
                        />
                    ))
                ) : (
                    <p>No comments yet</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;