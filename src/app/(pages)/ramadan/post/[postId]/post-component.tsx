'use client'; 

import { fetchSinglePostAction } from '@/actions/postActions';
import { useState } from 'react';

interface PostComponentProps {
  postId: string;
}

export default function PostComponent({ postId }: PostComponentProps) {
  const [inputValue, setInputValue] = useState('');
  const post = fetchSinglePostAction(postId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // console.log('Submitted:', inputValue, 'Post ID:', postId);
    // Add your form submission logic here
  };

  return (
    <div>
      <p>Post ID: {postId}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter something"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}