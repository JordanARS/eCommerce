const API_URL = 'http://localhost:3000/api';

async function inspect() {
  try {
    const categoriesRes = await fetch(`${API_URL}/categories`);
    const categories = await categoriesRes.json();
    console.log('Categories Count:', categories.length);

    const productsRes = await fetch(`${API_URL}/products`);
    const products = await productsRes.json();
    console.log('Products Count:', products.length);

    console.log('--- Detail Check ---');
    if (products.length > 0) {
        const firstId = products[0].id;
        const detailRes = await fetch(`${API_URL}/products/${firstId}`);
        const detail = await detailRes.json();
        console.log(`Product ${firstId} detail keys:`, Object.keys(detail));
        console.log(`Product ${firstId} categoryId:`, detail.categoryId);
    }

    console.log('--- Filter Check ---');
    if (categories.length > 0) {
        const catId = categories[0].id;
        console.log(`Testing filter for category ${catId}`);
        try {
            const filterRes = await fetch(`${API_URL}/products?categoryId=${catId}`);
            if (filterRes.ok) {
                const filtered = await filterRes.json();
                console.log(`Filtered by category ${catId}: ${filtered.length} products`);
            } else {
                console.log(`Filter by category ${catId} failed: ${filterRes.status}`);
            }
        } catch (e) { console.log('Filter error', e); }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

inspect();
