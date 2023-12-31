package consumer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/ashrhmn/social-media/comment-service/types"

	amqp "github.com/rabbitmq/amqp091-go"
)

type ConsumerConfig struct {
	Router     *types.Router
	QueueName  string
	Connection *amqp.Connection
}

type Consumer struct {
	config ConsumerConfig
}

func NewConsumer(config ConsumerConfig) *Consumer {
	return &Consumer{
		config: config,
	}
}

func (c *Consumer) Start() {

	channel, err := c.config.Connection.Channel()
	if err != nil {
		log.Fatal("Error creating rmq channel : ", err)
	}
	channel.QueueDeclare(
		c.config.QueueName,
		false,
		false,
		false,
		false,
		nil,
	)
	messages, err := channel.Consume(
		c.config.QueueName,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Error consuming rmq messages : ", err)
	}
	fmt.Println("Started consuming messages")
	for msg := range messages {
		svcMsg := types.ServiceMsg{}
		err := json.Unmarshal(msg.Body, &svcMsg)
		if err != nil {
			log.Println("Error unmarshalling message: ", err)
			continue
		}
		reply := c.config.Router.Handle(svcMsg.Pattern, svcMsg.Data)
		if reply != nil {
			err := channel.PublishWithContext(
				context.Background(),
				"",
				msg.ReplyTo,
				false,
				false,
				amqp.Publishing{
					ContentType:   "application/json",
					CorrelationId: msg.CorrelationId,
					Body:          reply,
				},
			)
			if err != nil {
				log.Println("Error publishing reply: ", err)
			}
		}
	}

}
