CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name varchar(50),
    last_name varchar(50),
    email varchar(100),
    address varchar(100),
    username varchar(50) UNIQUE,
    password varchar(50)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name varchar(100),
    brand varchar(100),
    price_cents INTEGER
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    placed_at datetime,
    status varchar(100)
);

CREATE TABLE orders_products (
    product_id INTEGER REFERENCES products(id),
    order_id INTEGER REFERENCES orders(id),
    quantity INTEGER,
    price_cents INTEGER
);

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    ttl datetime
);

-- Importing a products csv
COPY products (name, brand, price_cents)
FROM 'db_products.csv'
DELIMITER ','
CSV HEADER;