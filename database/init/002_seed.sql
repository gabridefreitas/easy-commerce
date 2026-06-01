COPY products(title, price, image, description)
FROM '/docker-entrypoint-initdb.d/seeds/products.csv'
DELIMITER ','
CSV HEADER;

COPY coupons(code, discount_percent)
FROM '/docker-entrypoint-initdb.d/seeds/coupons.csv'
DELIMITER ','
CSV HEADER;
