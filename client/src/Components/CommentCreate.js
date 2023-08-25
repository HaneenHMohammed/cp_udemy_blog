import React, { useState, useEffect } from "react";
import axios from 'axios';

function CreatePost(props) {
    const [content, setContent] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();

        if (content === '') {
            alert("Please fill all fields");
            return;
        }

        axios.post(`http://localhost:4002/posts/${props.postId}/comments`, {content});

        setContent('');
    }
    return(
        <div>
            <h4>Comment</h4>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input value={content} onChange={e => setContent(e.target.value)} className="form-control" />
                </div>
                <button className="btn btn-primary" style={{align: 'right'}}>Add Comment</button>
            </form>
        </div>
    )
}

export default CreatePost;