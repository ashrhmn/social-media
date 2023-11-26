package routes

import (
	"context"
	"encoding/json"

	"github.com/ashrhmn/social-media/comment-service/generated"
	"github.com/ashrhmn/social-media/comment-service/types"
)

func NewCommentRouter() *types.RouterGroup {
	router := types.NewRouterGroup()

	router.Register("CREATE_COMMENT", func(msg []byte, c *types.RouterContext) []byte {
		payload := generated.CreateCommentParams{}
		err := json.Unmarshal(msg, &payload)

		if err != nil {
			return nil
		}
		c.Db.Queries.CreateComment(context.Background(), payload)
		return nil
	})

	router.Register(("CREATE_CHILD_COMMENT"), func(msg []byte, c *types.RouterContext) []byte {
		payload := generated.CreateChildCommentParams{}
		err := json.Unmarshal(msg, &payload)

		if err != nil {
			return nil
		}
		c.Db.Queries.CreateChildComment(context.Background(), payload)
		return nil
	})

	return &router
}
