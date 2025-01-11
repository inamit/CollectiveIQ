import React, {useState} from "react";
import {FaRegThumbsUp, FaRegThumbsDown, FaTrash} from "react-icons/fa";
import EditIcon from '@mui/icons-material/Edit';
import "./Post.css";
import CommentSection from '../Comment/Comment.tsx';

//TODO: bring the new post when creating it + when he's clicked
//TODO: DELETE AND UPDATE ONLY IF THE POST IS OF THE USER ITSELF

const PostComponent = ({title, description, imageUrl}) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    //todo: get the comments from the backend
    const [comments, setComments] = useState( [
        { username: 'Jane Doe', text: 'Great post!', time: '1 hour ago' }
    ]);

    const [isEditing, setIsEditing] = useState(false); // New state for edit mode
    const [editableTitle, setEditableTitle] = useState(title?? "a really important question");
    const [editableDescription, setEditableDescription] = useState(description?? "when we will finish this project");

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true);
            if (disliked) {
                setDislikes(dislikes - 1);
                setDisliked(false);
            }
        }
    };

    const handleDislike = () => {
        if (!disliked) {
            setDislikes(dislikes + 1);
            setDisliked(true);
            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
            }
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };
    const onUpdatePostClicked=()=>{
        //TODO - UPDATE
    }

    const onDelete=() =>{
        //TODO - DELETE POST
    }

    const addComment = (newComment) => {
        setComments([...comments, newComment]);
        //TODO: save comment to DB
    };

    return (
        <div className="post-container">
            <div className="post-header">
                <div className="post-controls">
                    <button className="edit-button" onClick={toggleEditMode}>
                        <EditIcon />
                    </button>
                    <button className="delete-button" onClick={onDelete}>
                        <FaTrash />
                    </button>

                </div>

                <h2 className="post-title"> {isEditing ? (
                    <input
                        type="text"
                        value={editableTitle as string}
                        onChange={(e) => setEditableTitle(e.target.value)}
                    />
                ) : (
                    editableTitle
                )}</h2>
                <div className="post-user-info">
                    <img
                        className="user-avatar"
                        src="https://via.placeholder.com/40"
                        alt="User Avatar"
                    />
                    <div className="user-details">
                        <p className="post-time">2 hours ago</p>
                    </div>
                </div>

            </div>

            <div className="post-content">
                {isEditing ? (
                    <textarea
                        className="post-description-input"
                        value={editableDescription as string}
                        onChange={(e) => setEditableDescription(e.target.value)}
                    />
                ) : (
                    <p className="post-description">{editableDescription}</p>
                )}
                {imageUrl && (
                    <div className="post-image">
                        <img src={imageUrl} alt="Post" />
                    </div>
                )}
            </div>


            <div className="post-footer">
                <div className="post-actions">
                    <button className="icon-button" onClick={handleLike}>
                        <FaRegThumbsUp />
                    </button>
                    <span className="icon-count">{likes}</span>
                    <button className="icon-button" onClick={handleDislike}>
                        <FaRegThumbsDown />
                    </button>
                    <span className="icon-count">{dislikes}</span>
                </div>
            </div>

            <div >
                <p className="comment-count">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</p>
            </div>

            <CommentSection comments={comments} addComment={addComment} />
        </div>
    );
};

export default PostComponent;