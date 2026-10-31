// Hand-written migrations, applied in order by migrate(). Each runs once,
// tracked in the _migrations table. Append a new entry for every schema change.
export const migrations: { name: string; sql: string }[] = [
  {
    name: "0001_init",
    sql: `
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  alias text NOT NULL UNIQUE,
  is_student boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_sessions_user_idx ON auth_sessions (user_id);

CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood integer NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mood_entries_user_idx ON mood_entries (user_id, created_at);

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  mood integer,
  prompt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS journal_entries_user_idx ON journal_entries (user_id, created_at);

CREATE TABLE IF NOT EXISTS talk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  arrival_state text,
  created_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  post_mood integer,
  reflection text
);
CREATE INDEX IF NOT EXISTS talk_sessions_user_idx ON talk_sessions (user_id, created_at);

CREATE TABLE IF NOT EXISTS session_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES talk_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'companion')),
  content text NOT NULL,
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS session_messages_session_idx ON session_messages (session_id, created_at);

CREATE TABLE IF NOT EXISTS circle_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alias text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS circle_posts_circle_idx ON circle_posts (circle_id, created_at);

CREATE TABLE IF NOT EXISTS circle_post_likes (
  post_id uuid NOT NULL REFERENCES circle_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
`,
  },
  {
    name: "0002_email_verification",
    sql: `
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;
CREATE TABLE IF NOT EXISTS email_verifications (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_verifications_user_idx ON email_verifications(user_id);
`,
  },
  {
    name: "0003_session_consent",
    sql: `ALTER TABLE talk_sessions ADD COLUMN IF NOT EXISTS consent_version text;`,
  },
  {
    name: "0004_password_resets",
    sql: `
CREATE TABLE IF NOT EXISTS password_resets (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_resets_user_idx ON password_resets(user_id);
`,
  },
];
