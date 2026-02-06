const API_URL = 'http://localhost:3000/api';

async function inspectDetail() {
  try {
    // ID 8 is from the previous output
    const res = await fetch(`${API_URL}/products/8`);
    const product = await res.json();
    console.log('Product 8 Detail:', JSON.stringify(product, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectDetail();