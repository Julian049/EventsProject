INSERT INTO category (name, description, status) VALUES
('Música',      'Conciertos y festivales',     true),
('Deportes',    'Eventos deportivos',           true),
('Teatro',      'Obras y espectáculos',         true),
('Circo',       'Espectáculos circenses',       true),
('Conferencia', 'Charlas y conferencias',       true);


INSERT INTO users (name, email, password, role) VALUES
('Admin Principal', 'admin@eventos.com', '$2b$10$placeholderhashadmin', 'Admin');

INSERT INTO event (name, date, description, image, category_id, price, status)
SELECT
    'Evento #' || i,
    NOW() + (i || ' days')::interval,
    'Descripción del evento número ' || i,
    'https://picsum.photos/seed/' || i || '/800/600',
    (i % 5) + 1,
    (random() * 200000 + 10000)::numeric(10,2),
    true
FROM generate_series(1, 1000) AS s(i);