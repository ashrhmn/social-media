package main

import (
	"flag"
	"log"
	"os"

	"github.com/ashrhmn/social-media/comment-service/consumer"
	"github.com/ashrhmn/social-media/comment-service/db"
	"github.com/ashrhmn/social-media/comment-service/routes"
	"github.com/ashrhmn/social-media/comment-service/types"
	"github.com/joho/godotenv"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	godotenv.Load()
	dbUrl := flag.String("COMMENT_DB_URL", os.Getenv("COMMENT_DB_URL"), "Database URL")
	rmqUrl := flag.String("RMQ_URL", os.Getenv("RMQ_URL"), "RabbitMQ URL")
	queueName := flag.String("COMMENT_QUEUE_NAME", os.Getenv("COMMENT_QUEUE_NAME"), "Queue name")
	flag.Parse()
	if *dbUrl == "" {
		panic("COMMENT_DB_URL not set")
	}
	if *rmqUrl == "" {
		panic("RMQ_URL not set")
	}
	if *queueName == "" {
		panic("COMMENT_QUEUE_NAME not set")
	}
	dbService, err := db.NewDbService(db.DbServiceConfig{
		DriverName: "pgx",
		DbUrl:      *dbUrl,
	})
	if err != nil {
		log.Fatal("Error connecting to postgres : ", err)
	}
	amqpConnection, err := amqp.Dial(*rmqUrl)
	if err != nil {
		log.Fatal("Error connecting to rabbitmq : ", err)
	}
	routerContext := types.RouterContext{
		Db:             dbService,
		AmqpConnection: amqpConnection,
	}
	router := types.NewRouter(&routerContext)

	router.Register("PING", func(msg []byte, c *types.RouterContext) []byte {
		return c.Success("PONG")
		// return c.Error("PING not supported")
	})

	router.Mount(routes.NewCommentRouter)

	consumerConfig := consumer.ConsumerConfig{
		Router:     router,
		QueueName:  *queueName,
		Connection: amqpConnection,
	}
	c := consumer.NewConsumer(consumerConfig)
	c.Start()
}
