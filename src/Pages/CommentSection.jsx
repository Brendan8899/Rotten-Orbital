import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { db } from "../firebase.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import CommentCard from './CommentCard';

const API_IMG = "https://image.tmdb.org/t/p/w500/";
const MAX_WORDS = 500; // Maximum Number of Words Allowed

export const CommentSection = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const commentCollectionRef = collection(db, "Comments");
  const title = searchParams.get('title');
  const poster = searchParams.get('poster');
  const vote = searchParams.get('vote');
  const release = searchParams.get('release');
  const overview = searchParams.get('overview');
  const movieid = searchParams.get('id');
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function saveTimestampToFirestore() {
    const timestampInMillis = Date.now();
    const timestamp = Timestamp.fromMillis(timestampInMillis);
    return timestamp;
  }

  const createComment = async () => {
    await addDoc(commentCollectionRef, {
      Comment: newComment,
      movieid: movieid,
      time: saveTimestampToFirestore(),
      username: "testing"
    });
  
    // Fetch the updated comment list from the database
    const q = query(collection(db, 'Comments'), where('movieid', '==', movieid));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map((doc) => doc.data());
    setCommentList(comments);
  
    // Clear the comment input
    setNewComment('');
  };
  

  const deleteComment = async (id) => {
    const commentDoc = doc(db, "Comments", id);
    await deleteDoc(commentDoc);
  
    // Fetch the updated comment list from the database
    const q = query(collection(db, 'Comments'), where('movieid', '==', movieid));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
    setCommentList(comments);
  };
  

  const updateComment = async (id, updatedComment) => {
    const commentDoc = doc(db, "Comments", id);
    await updateDoc(commentDoc, { Comment: updatedComment })

    const q = query(collection(db, 'Comments'), where('movieid', '==', movieid));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
    setCommentList(comments);
  }
  
  useEffect(() => {
    const getCommentList = async () => {
        const q = query(collection(db, 'Comments'), where('movieid', '==', movieid));
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
          setCommentList(comments);
        };
    getCommentList();
  }, []);

  // Calculate the number of filled stars based on the vote
  const filledStars = Math.round(vote / 2);

  // Create an array to store the star elements
  const starElements = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`star ${index < filledStars ? 'filled' : ''}`}
    />
  ));

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    // Trim the new comment to remove leading and trailing spaces
    const trimmedComment = newComment.trim();
  
    // Split into words using spaces and do word count
    const words = trimmedComment.split(' ');
    const wordCount = words.length;
  
    // Check if the comment is empty or exceeds the word limit
    if (trimmedComment === '') {
      // Display an error message
      setErrorMessage('Unable to create empty comment');
      return;
    }
    if (wordCount > MAX_WORDS) {
      setErrorMessage('Exceeded Word Limit: 500');
      return;
    } 
    // Add the new comment to the comments array
    const updatedComments = [...commentList, trimmedComment];
    setCommentList(updatedComments);
    // Create the comment in the database
    await createComment();
    // Clear the comment input
    setNewComment('');
    setErrorMessage('');
    window.location.reload();
  };
  

  return (
    <div className="comment-section-container">
      <div className="image-container">
        <img src={API_IMG + poster} alt="Movie Poster" />
      </div>
      <h1>{title}</h1>
      <div className="details-container">
        <div className="rating-container">
          <span className="rating-label">IMDB Rating:</span>
          <div className="star-rating">{starElements}</div>
        </div>
        <div className="release-date-container">
          <span className="release-date-label">Release Date:&nbsp;</span>
          <span className="release-date">{release}</span>
        </div>
      </div>
      <h2 className="comment-title">Summary</h2>
      <p className="overview">{overview}</p>
      <h2 className="comment-title">Comments</h2>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment"
        />
        <button className="submit-button">Submit</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <div className="comment-list">
        {commentList.map((comment, index) => (
              <CommentCard
              key={index}
              comment={comment}
              handleDelete={() => deleteComment(comment.id)}
              handleUpdate={(updatedComment) => updateComment(comment.id, updatedComment)}
            />
            ))}
          </div>
        </div>
      );
    }