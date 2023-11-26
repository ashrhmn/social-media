package db

import (
	"database/sql"

	"github.com/ashrhmn/social-media/comment-service/generated"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type DbService struct {
	Db      *sql.DB
	Queries *generated.Queries
}

type DbServiceConfig struct {
	DriverName string
	DbUrl      string
}

func NewDbService(config DbServiceConfig) (*DbService, error) {
	db, err := sql.Open(
		config.DriverName,
		config.DbUrl,
	)
	if err != nil {
		return nil, err
	}
	queries := generated.New(db)
	service := DbService{
		Db:      db,
		Queries: queries,
	}
	return &service, nil
}
