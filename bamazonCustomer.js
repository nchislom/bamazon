var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "woohoohoodiwoo",
  database: "bamazon"
});

function getInventory(selected_item_id){
  connection.query('SELECT stock_quantity FROM products WHERE item_id = ?', [selected_item_id], function (error, result) {
    if (error) throw error;
    console.log(result[0].stock_quantity);
    connection.end();
  });
}

function createProduct(name, dept, price, qty) {
  // console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: name,
      department_name: dept,
      price: price,
      stock_quantity: qty
    },
    function(err, result) {
      console.log(result.affectedRows + " product inserted!\n");
    }
  );
  connection.end();
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
  console.log("Selling " + purchaseQty + " of productid: " + item_id);
  console.log("Current quantity is: " + currentQty);
  connection.end();
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

  connection.end();
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

function promptCustomer() {
  inquirer
    .prompt([
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
    ).then(readProducts());
}

getInventory(2);

// Tests
// sellProduct(2, 1);
// promptCustomer();