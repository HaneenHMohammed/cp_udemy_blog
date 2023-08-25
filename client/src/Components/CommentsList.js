import React from "react";

function CommentsList(props) {

    const renderedComments = Object.values(props.comments).map( comment => {
        let display = comment.content;

        if (comment.status === "PENDING") {
            display = "This comment is awaiting approval";
        } 
        else if (comment.status === "REJECTED") {
            display = "This comment has been rejected";
        }

        return(
            <div key={comment.id}>
                <li style={{whiteSpace: "pre-wrap"}}>{display}</li>
            </div>
            )
        }
    )

    return(
        <div>
            <h4>{renderedComments.length} Comments</h4>
            <ul>
                {renderedComments}
            </ul>
        </div>
    )
}

export default CommentsList;