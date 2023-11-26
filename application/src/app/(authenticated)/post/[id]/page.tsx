import React from "react";

const PostDetailsPage = ({ params: { id } }: any) => {
  return (
    <div>
      <h1 className="text-center font-bold text-3xl">
        Post Details Page with auth required
      </h1>
      <p>Post ID: {id}</p>
    </div>
  );
};

export default PostDetailsPage;
