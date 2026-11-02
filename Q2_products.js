// Promise chaining implementation matching requirements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const gridEl = document.getElementById('products-grid');

fetch('https://dummyjson.com/products')
    .then(response => {
        console.log(`Response Status Code: ${response.status}`);
        if (!response.ok) {
            throw new Error(`Failed to request store data. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const products = data.products;
        
        // Log the brand of the first product explicitly
        if (products.length > 0) {
            console.log(`First product brand identity: ${products[0].brand}`);
        }

        loadingEl.style.display = 'none';
        
        // Slice to render at least six items safely
        products.slice(0, 6).forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="img-container">
                    ${product.thumbnail ? `<img src="${product.thumbnail}" alt="${product.title}">` : '<span>No Image</span>'}
                </div>
                <div class="product-info">
                    <span class="product-brand">${product.brand || 'Generic'}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                </div>
            `;
            gridEl.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Fetch execution caught exception chain:', error);
        loadingEl.style.display = 'none';
        errorEl.innerText = error.message || 'An error occurred fetching products execution context.';
        errorEl.style.display = 'block';
    });
