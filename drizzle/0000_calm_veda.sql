CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"kinde_id" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"title" varchar(50) NOT NULL,
	"role" varchar(20) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_kinde_id_unique" UNIQUE("kinde_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name) VALUES
  ('admin'),
  ('user')
ON CONFLICT (name) DO NOTHING; 