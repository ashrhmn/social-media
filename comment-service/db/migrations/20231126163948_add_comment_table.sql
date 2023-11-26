-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  parent_id UUID,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL default now(),
  updated_at TIMESTAMPTZ NOT NULL default now()
);
-- migrate:down
DROP TABLE comment;
-- DROP EXTENSION IF EXISTS "uuid-ossp";