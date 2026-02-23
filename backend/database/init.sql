CREATE TABLE IF NOT EXISTS category (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL CHECK (TRIM(name) <> ''),
    description TEXT,
    status      BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS event (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL CHECK (TRIM(name) <> ''),
    date        TIMESTAMP,
    description TEXT,
    image       TEXT,
    category_id INTEGER REFERENCES category(id),
    price       NUMERIC(10,2) CHECK (price >= 0),
    status      BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS interaction (
    id         SERIAL PRIMARY KEY,
    event_id   INTEGER NOT NULL REFERENCES event(id),
    type       VARCHAR(50) CHECK (type IN ('click', 'view')),
    created_at TIMESTAMP DEFAULT NOW()
);