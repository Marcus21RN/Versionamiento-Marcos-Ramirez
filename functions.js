// Open (or create) the database with the version 1
let db;
const request = indexedDB.open('exampleProductDB', 1);

request.onerror = function(event) {
    console.error("Database error: ", event.target.error);
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadProductTable(); // Load products after the database is opened
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore('products', { keyPath: 'id' });
};

//Load/Read products from IndexedDB and display them in the table
function loadProductTable() {
    const transaction = db.transaction(['products'], 'readonly');
    const store = transaction.objectStore('products');

    const request = store.getAll();

    request.onsuccess = function(event) {
        const products = event.target.result;
        const tableBody = document.querySelector('#productsTable tbody');
        tableBody.innerHTML = ''; // Clear the table before adding new products

        products.forEach(product => {
            //Create a table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td><button class="delete-btn" data-id="${product.id}">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });

    //Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteProduct);
        });
    };
}

//Add/Create a new product
function addProduct() {
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);

    //Validate inputs
    if (!name || isNaN(price) || price <= 0) {
        alert("Please enter a valid name and price.");
        return;
    }

    const transaction = db.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');

    //Get/Read the products
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function(event) {
        const products = event.target.result;
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1, // Assign an incremental ID
            name: name,
            price: price
        };

    //Add/Create the new product to the DB
        store.add(newProduct);
        //Clear the form fields
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';

    //Update the table with the new product
        loadProductTable();
    };
}

//Delete a product
function deleteProduct(event) {
    const productId = parseInt(event.target.getAttribute('data-id')); // Get the product ID from the button's data attribute
    const transaction = db.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');

    //Delete the product with the corresponding ID
    store.delete(productId);

    //Reload the product table to reflect changes
    loadProductTable();
}

//Event listener for the button click
document.getElementById('addProduct').addEventListener('click', addProduct);

function createLeafParticles() {
    const particleLayer = document.createElement('div');
    particleLayer.className = 'leaf-particles';
    particleLayer.setAttribute('aria-hidden', 'true');

    const leafColors = ['#6f8f3d', '#8fa94f', '#b0bd66', '#d18b3b'];

    for (let index = 0; index < 22; index += 1) {
        const leaf = document.createElement('span');
        const randomBetween = (minimum, maximum) => Math.random() * (maximum - minimum) + minimum;

        leaf.className = 'leaf-particle';
        leaf.style.setProperty('--leaf-left', `${randomBetween(-5, 100)}vw`);
        leaf.style.setProperty('--leaf-size', `${randomBetween(10, 22)}px`);
        leaf.style.setProperty('--leaf-opacity', randomBetween(0.55, 0.9).toFixed(2));
        leaf.style.setProperty('--leaf-color', leafColors[index % leafColors.length]);
        leaf.style.setProperty('--leaf-duration', `${randomBetween(9, 18).toFixed(2)}s`);
        leaf.style.setProperty('--leaf-delay', `${randomBetween(-18, 0).toFixed(2)}s`);
        leaf.style.setProperty('--leaf-drift-one', `${randomBetween(-12, 12).toFixed(2)}vw`);
        leaf.style.setProperty('--leaf-drift-two', `${randomBetween(-18, 18).toFixed(2)}vw`);
        leaf.style.setProperty('--leaf-drift-three', `${randomBetween(-25, 25).toFixed(2)}vw`);
        particleLayer.appendChild(leaf);
    }

    document.body.appendChild(particleLayer);
}

createLeafParticles();