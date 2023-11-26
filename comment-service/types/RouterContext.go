package types

import (
	"encoding/json"

	"github.com/ashrhmn/social-media/comment-service/db"
	amqp "github.com/rabbitmq/amqp091-go"
)

type RouterContext struct {
	Db             *db.DbService
	AmqpConnection *amqp.Connection
}

func (c *RouterContext) Success(response any) []byte {
	responseBytes, err := json.Marshal(map[string]any{
		"response": response,
	})
	if err != nil {
		panic(err)
	}
	return responseBytes
}

func (c *RouterContext) Error(err any) []byte {
	responseBytes, err := json.Marshal(map[string]any{
		"err": err,
	})
	if err != nil {
		panic(err)
	}
	return responseBytes
}
