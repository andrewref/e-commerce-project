let productsList=[];

async function getProducts()
{ try {
    let response = await fetch("https://fakestoreapi.com/products");
     if (!response.ok) throw new Error("Network response was not ok");
    let data =  await response.json();
    productsList=data;
    displayProducts();
} catch (error) {
    console.error('fetch error:',error)
}
    

}
getProducts();
let products = document.getElementById("rowData");

function displayProducts(productArray = productsList) {
  products.innerHTML = '';

  productArray.forEach(product => {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-4 mb-4';

    const card = document.createElement('div');
    card.className = 'card h-100';

    const image = document.createElement('img');
    image.src = product.image;
    image.className = 'card-img-top';
    image.alt = product.title;
    image.style.height = "250px";
    image.style.objectFit = "contain";

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = product.title;

    const price = document.createElement('p');
    price.className = 'card-text text-danger';
    price.textContent = `Price: $${product.price}`;

    const category = document.createElement('p');
    category.className = 'card-text text-muted';
    category.textContent = `Category: ${product.category}`;

    const rating = document.createElement('p');
    rating.className = 'card-text';
    rating.textContent = `Rating: ${product.rating.rate} ⭐ (${product.rating.count} reviews)`;

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary w-100';
    btn.textContent = 'Add to Cart';
    btn.onclick = () => addToCart(product);

    cardBody.append(title, price, category, rating, btn);
    card.append(image, cardBody);
    colDiv.appendChild(card);
    products.appendChild(colDiv);
  });
}

let searchInput= document.getElementById("searchInput");
searchInput.addEventListener('input', function(){
    let searchItem= searchInput.value.toLowerCase();
    let filteredItem = productsList.filter(product => product.title.toLowerCase().includes(searchItem))
    displayProducts(filteredItem);
})






