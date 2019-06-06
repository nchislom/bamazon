var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "woohoohoodiwoo",
  database: "bamazon"
});

// Function used to execute asynchronous operations in sequence
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
var resolveAfter1Second = function() {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve("fast");
    }, 1000);
  });
};

// Used to return current inventory of selected_item_id
async function getInventory(selected_item_id){
  connection.query('SELECT stock_quantity FROM products WHERE item_id = ?', [selected_item_id], function (error, result) {
    if (error) throw error;
    return result[0].stock_quantity;
  });
  connection.end();
}

// Used to return cost of selected_item_id
async function getCost(selected_item_id) {
  connection.query('SELECT price FROM products WHERE item_id = ?', [selected_item_id], function (error, result) {
    if (error) throw error;
    return result[0].price;
  });
  connection.end();
}

function sellProduct(item_id, qty) {
  let currentQty = getInventory(item_id);
  let itemCost = getCost(item_id);
  let orderTotal = parseFloat(itemCost * qty).toFixed(2);
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
        console.log("Order Total: " + orderTotal);
      }
    );
  } else {
    console.log("Insufficient quantity available!");
  }
}

// Used to return products
function readProducts() {
  connection.query("SELECT * FROM products", function(err, products) {
    if (err) throw err;
    for(product in products){
      console.log(products[product].item_id
        + ": "
        + products[product].product_name
        + ", $"
        + parseFloat(products[product].price).toFixed(2)
      );
    }
    console.log("-----------------------------------------------");
  });
  connection.end();
}

// Inquirer prompt for user input
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
  );
}

// asynchronous flow, trying to prevent prompts/outputs from firing before sql query completes...
var getCustomerInput = async function() {
  readProducts();
  await resolveAfter1Second();
  promptCustomer();
}

getCustomerInput();