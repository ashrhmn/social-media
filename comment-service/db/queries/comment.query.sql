-- name: FindParentCommentsByPostId :one
SELECT *
FROM comments
WHERE parent_id IS NULL
  AND post_id = $1;
-- name: CreateChildComment :exec
INSERT INTO comments (user_id, post_id, parent_id, content)
VALUES ($1, $2, $3, $4);
-- name: CreateComment :exec
INSERT INTO comments (user_id, post_id, content)
VALUES ($1, $2, $3);