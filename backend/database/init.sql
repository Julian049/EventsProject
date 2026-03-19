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
    status      VARCHAR(20)  NOT NULL DEFAULT 'Active'
        CHECK (status IN ('Active', 'Sold_out', 'Inactive'))
);

CREATE TABLE IF NOT EXISTS ticket_types
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL CHECK (TRIM(name) <> '')
);

CREATE TABLE IF NOT EXISTS event_ticket_types
(
    id                 SERIAL PRIMARY KEY,
    event_id           INTEGER        NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    price              NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    total_quantity     INTEGER        NOT NULL CHECK (total_quantity > 0),
    available_quantity INTEGER        NOT NULL CHECK (available_quantity >= 0),
    ticket_type_id     INTEGER        NOT NULL REFERENCES ticket_types (id) ON DELETE RESTRICT,
    UNIQUE (event_id, ticket_type_id),
    CHECK (available_quantity <= total_quantity)
);

CREATE TABLE IF NOT EXISTS purchases
(
    id                   SERIAL PRIMARY KEY,
    user_id              INTEGER        NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    event_ticket_type_id INTEGER        NOT NULL REFERENCES event_ticket_types (id) ON DELETE RESTRICT,
    quantity             INTEGER        NOT NULL CHECK (quantity > 0),
    total_amount         NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status               VARCHAR(20)    NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Completed')),
    created_at           TIMESTAMP               DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets
(
    id          SERIAL PRIMARY KEY,
    purchase_id INTEGER     NOT NULL REFERENCES purchases (id) ON DELETE CASCADE,
    qr_code     TEXT UNIQUE NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'Active'
        CHECK (status IN ('Active', 'Used')),
    created_at  TIMESTAMP            DEFAULT NOW()
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