const axios = require("axios");
const store = require("/home/russell/rmit/full_stack_dev/project/s4018548-s4007180-a2/client/src/data/store.json");

async function addProduct() {
  store.products.forEach(async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/products/",
        product
      );
      console.log(`Added product: ${response.data.name}`);
    } catch (error) {
      console.error(`Error adding product: ${product.name}`, error);
    }
  });
}

addProduct();
