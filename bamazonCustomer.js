var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "woohoohoodiwoo",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId + "\n");
  // createProduct();
});

function getInventory(selected_item_id){
  let query = connection.query(
    'SELECT * FROM `products` WHERE `item_id` = ?',
    selected_item_id,
    function (error, results, fields) {
      if(error) throw error;
      return results[0].stock_quantity;
    }
  );
}

function createProduct() {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      flavor: "Rocky Road",
      price: 3.0,
      quantity: 50
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      updateProduct();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function sellProduct(item_id, purchaseQty) {
  let currentQty = getInventory(item_id);
  if(currentQty >= purchaseQty){
    currentQty -= purchaseQty;
    let query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: currentQty
        },
        {
          item_id: item_id
        }
      ],
      function(err, res) {
        console.log("Thank you for your purchase!");
      }
    );
  } else {
    console.log("Insufficient quantity available!");
  }
}

function deleteProduct() {
  console.log("Deleting all strawberry icecream...\n");
  connection.query(
    "DELETE FROM products WHERE ?",
    {
      flavor: "strawberry"
    },
    function(err, res) {
      console.log(res.affectedRows + " products deleted!\n");
      // Call readProducts AFTER the DELETE completes
      readProducts();
    }
  );
}

function readProducts() {
    connection.query("SELECT * FROM products", function(err, products) {
        if (err) throw err;
        for(product in products){
            console.log(products[product].item_id
                + ": "
                + products[product].product_name
                + ", $"
                + parseFloat(products[product].price).toFixed(2));
        }
        console.log("-----------------------------------------------");
        connection.end();
    });
}

readProducts();

inquirer.prompt([
    {
        type: "input",
        name: "product_id",
        message: "Enter product ID# to purchase:"
    },
    {
        type: "input",
        name: "quantity",
        message: "Enter quantity to purchase:"
    }
]).then(function(userInput)
    {
      sellProduct(userInput.product_id, userInput.quantity);
    }
);
