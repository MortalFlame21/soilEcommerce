const axios = require("axios");
const store = require("../../../client/src/data/store.json");

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
