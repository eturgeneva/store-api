CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    first_name varchar(50),
    last_name varchar(50),
    email varchar(100),
    address varchar(100),
    username varchar(50) UNIQUE,
    password varchar(50)
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name varchar(100),
    brand varchar(100),
    price_cents INTEGER
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
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
    id INTEGER PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id)
);