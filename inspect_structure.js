const API_URL = 'http://localhost:3000/api';

async function inspect() {
  try {
    const productsRes = await fetch(`${API_URL}/products`);
    const products = await productsRes.json();
    
    if (products.length > 0) {
        console.log('Sample Product Full JSON:', JSON.stringify(products[0], null, 2));
    } else {
        console.log('No products found');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

inspect();