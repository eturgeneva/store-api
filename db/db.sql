CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name varchar(50),
    last_name varchar(50),
    email varchar(100) UNIQUE,
    address varchar(100),
    username varchar(50) UNIQUE,
    password varchar(100)
);

CREATE TABLE federated_credentials (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    provider varchar(100),
    subject varchar(100)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name varchar(100) UNIQUE,
    brand varchar(100),
    price_cents INTEGER
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    placed_at TIMESTAMP DEFAULT NOW(),
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
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE carts_products (
    cart_id INTEGER REFERENCES carts(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER
);

-- Wishlist
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
);

CREATE TABLE wishlists_products (
    wishlist_id INTEGER REFERENCES wishlists(id),
    product_id INTEGER REFERENCES products(id)
);

-- Importing a products csv (via psql)
COPY products (name, brand, price_cents)
FROM './db_products.csv'
DELIMITER ','
CSV HEADER;

-- Or try this
\copy products (name, brand, price_cents) FROM './db_products.csv' DELIMITER ',' CSV HEADER;
