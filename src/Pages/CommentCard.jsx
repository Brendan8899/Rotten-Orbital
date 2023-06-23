import React, { useEffect, useState } from "react";
import deleteIcon from './delete.icon.svg';
import editIcon from './edit.icon.svg';

const CommentCard = ({ comment, handleDelete, handleUpdate }) => {
  const { Comment, movieid, time, username } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(Comment);

  const publishDate = time ? new Date(time.toMillis()).toLocaleString() : '';

  const handleInputChange = (event) => {
    setUpdatedComment(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateClick = () => {
    handleUpdate(updatedComment);
    setIsEditing(false);
  };

  return (
    <div className="comment-card">
      <div className="comment-card-header">
        <span className="username">{username}</span>
        <span className="publish-date">posted on {publishDate}</span>
      </div>
      <div className="comment-card-content">
        {isEditing ? (
          <textarea
            className="comment-textarea"
            value={updatedComment}
            onChange={handleInputChange}
          />
        ) : (
          <div>{Comment}</div>
        )}
      </div>
      <div className="comment-card-buttons">
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleEditClick}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button onClick={handleUpdateClick}>Save</button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
