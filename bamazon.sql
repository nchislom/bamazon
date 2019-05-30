DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Moog One", "Musical Instruments", 5999.00, 3)
      ,("Waldorf Quantum", "Musical Instruments", 4299.00, 4)
      ,("Strymon Big Sky", "Musical Instruments", 499.00, 9)
      ,("Strymon TimeLine", "Musical Instruments", 449.00, 12)
      ,("Sony Playstation 4, 1TB Console", "Home Entertainment", 299.99, 19)
      ,("Microsoft XBox One X, 1TB Console", "Home Entertainment", 399.99, 21)
      ,("Canon EOS RP Mirrorless Camera Bundle", "Camera & Photo", 1699.99, 5)
      ,("Sony Alpha a7 Mirrorless Camera Bundle", "Camera & Photo", 999.99, 7)
      ,("Canon EOS M100", "Camera & Photo", 399.00, 16)
      ,("Avengers: Infinity War", "Movies & TV", 18.99, 10)
      ,("Avengers Endgame", "Movies & TV", 24.99, 10)
      ,("Aquaman", "Movies & TV", 23.99, 13)
      ,("The Lego Movie 2: The Second Part", "Movies & TV", 22.99, 15);