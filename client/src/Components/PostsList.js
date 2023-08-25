import React, { useState, useEffect } from "react";
import axios from 'axios';
import CreateComment from './CommentCreate';
import CommentsList  from "./CommentsList";

function PostsList() {
    const [posts, setPosts] = useState({});

    const fetchPosts = async() => {
        const res = await axios.get('http://localhost:4006/posts').catch((error) => {
            console.log(error.message);
        });
        setPosts(res.data);
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    const renderedPosts = Object.values(posts).map( post => {
        return <div className="card" key={post.id} style={{width: '30%', marginBottom: '20px'}}>
            <div className="card-body">
                <h3>{post.title} </h3>
                <p style={{whiteSpace: "pre-wrap"}}>{post.content}</p>
                <hr />
                <CommentsList comments={post.comments} />
                <hr />
                <CreateComment postId={post.id} />
            </div>
        </div>
    })

    return(
        <div className="d-flex flex-row justify-content-between">
            {renderedPosts}
        </div>
    )
}

export default PostsList;