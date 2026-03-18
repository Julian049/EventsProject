CREATE TABLE IF NOT EXISTS categories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL CHECK (TRIM(name) <> ''),
    description TEXT,
    status      BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS users
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(150)        NOT NULL CHECK (TRIM(name) <> ''),
    email    VARCHAR(255) UNIQUE NOT NULL CHECK (TRIM(email) <> ''),
    password TEXT                NOT NULL,
    role     VARCHAR(20)         NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'Member'))
);

CREATE TABLE IF NOT EXISTS events
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL CHECK (TRIM(name) <> ''),
    date        TIMESTAMP,
    description TEXT,
    image       TEXT,
    category_id INTEGER REFERENCES categories (id),
    price       NUMERIC(10, 2) CHECK (price >= 0),
    status      BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS interactions
(
    id         SERIAL PRIMARY KEY,
    event_id   INTEGER NOT NULL REFERENCES events (id),
    type       VARCHAR(50) CHECK (type IN ('click')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users (id),
    event_id   INTEGER NOT NULL REFERENCES events (id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, event_id)
);