import React, { useState } from 'react';
import './Comment.css';
import { Comment as CommentIcon } from '@mui/icons-material';
import {Button, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
const Comment = ({ username, text, time }) => {
    return (
        <div className="comment-container">
            <div className="comment-header" style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src="https://via.placeholder.com/40" alt="User Avatar" style={{ marginRight: '8px' }} />
                <div className="comment-details">
                    <Typography variant="body2" sx={{mb: 2}} className="comment-username" style={{ fontWeight: 'bold' }}>
                        {username}
                    </Typography>
                    <Typography variant="body2" sx={{mb: 2}} className="comment-time" style={{ color: '#999' }}>
                        {time}
                    </Typography>
                </div>
            </div>
            <Typography variant="body2" sx={{mb: 2}} className="comment-text" style={{ marginTop: '10px' }}>
                {text}
            </Typography>
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
        < textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
        />
                <Button
                    onClick={handleAddComment}
                    variant="contained"
                    size="small"
                    startIcon={<CommentIcon />}
                    style={{ marginTop: '8px' }}
                >
                    Add Comment
                </Button>
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