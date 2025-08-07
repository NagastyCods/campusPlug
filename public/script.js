document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html") || currentPage.endsWith("/")) {
        handleViewSpecButtons();
        handleOrderNowButtons(); 
    }

    if (currentPage.includes("viewspec.html")) {
        displayProductSpec();
    }

    if (currentPage.includes("checkout.html")) {
        displayCheckoutProduct();
    }
});

function handleViewSpecButtons() {
    const specButtons = document.querySelectorAll(".spec-btn");

    specButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const product = btn.closest(".product1");
            const name = product.querySelector("h3").textContent.trim();
            const imgSrc = product.querySelector("img").getAttribute("src");
            const price = product.querySelector(".new-price").textContent.trim();

            const specs = getProductSpecs(name);

            const productDetails = {
                name,
                img: imgSrc,
                price,
                specs
            };

            localStorage.setItem("specProduct", JSON.stringify(productDetails));
            window.location.href = "viewspec.html";
        });
    });
}

function getProductSpecs(name) {
    const specsMap = {
        "Galaxy s23": {
            brand: "Samsung",
            model: "S23",
            processor: "Octa-Core 3.2GHz",
            ram: "12GB",
            storage: "256GB",
            display: "6.1-inch AMOLED",
            battery: "3900mAh",
            camera: "50MP + 12MP + 10MP, 12MP front",
            os: "Android 13",
            price: "Ghs 2000",
            availability: "In Stock",
            warranty: "1 Year"
        },
        "Galaxy note 9": {
            brand: "Samsung",
            model: "Note 9",
            processor: "Octa-Core 2.8GHz",
            ram: "6GB",
            storage: "128GB",
            display: "6.4-inch AMOLED",
            battery: "4000mAh",
            camera: "12MP + 12MP, 8MP front",
            os: "Android 10",
            price: "Ghs 2000",
            availability: "In Stock",
            warranty: "1 Year"
        },
        "Galaxy note 10": {
            brand: "Samsung",
            model: "Note 10",
            processor: "Octa-Core 2.9GHz",
            ram: "8GB",
            storage: "256GB",
            display: "6.3-inch AMOLED",
            battery: "3500mAh",
            camera: "12MP + 12MP + 16MP, 10MP front",
            os: "Android 11",
            price: "Ghs 2000",
            availability: "In Stock",
            warranty: "1 Year"
        },
        "Galaxy s24 ultra": {
            brand: "Samsung",
            model: "S24 Ultra",
            processor: "Octa-Core 3.4GHz",
            ram: "16GB",
            storage: "512GB",
            display: "6.8-inch AMOLED",
            battery: "5000mAh",
            camera: "200MP + 12MP + 10MP, 40MP front",
            os: "Android 14",
            price: "Ghs 2000",
            availability: "In Stock",
            warranty: "1 Year"
        },
        "Iphone 15promax": {
            brand: "Apple",
            model: "iPhone 15 Pro Max",
            processor: "A17 Pro",
            ram: "8GB",
            storage: "256GB",
            display: "6.7-inch Super Retina XDR",
            battery: "4422mAh",
            camera: "48MP + 12MP + 12MP, 12MP front",
            os: "iOS 17",
            price: "Ghs 2000",
            availability: "In Stock",
            warranty: "1 Year"
        },
        "Iphone 14 promax": {
            brand: "Apple",
            model: "iPhone 14 Pro Max",
            processor: "A16 Bionic",
            ram: "6GB",
            storage: "256GB",
            display: "6.7-inch OLED",
            battery: "4323mAh",
            camera: "48MP + 12MP + 12MP, 12MP front",
            os: "iOS 16",
            price: "Ghs 2000",
            availability: "In Stock",
            warranty: "1 Year"
        }
    };

    return specsMap[name] || {
        brand: "Unknown",
        model: "Unknown",
        processor: "N/A",
        ram: "N/A",
        storage: "N/A",
        display: "N/A",
        battery: "N/A",
        camera: "N/A",
        os: "N/A"
    };
}

function displayProductSpec() {
    const product = JSON.parse(localStorage.getItem("specProduct"));

    if (!product) return;

    const specFields = document.querySelectorAll("dd");
    const specs = [
        product.name,
        product.specs.brand,
        product.specs.model,
        product.specs.processor,
        product.specs.ram,
        product.specs.storage,
        product.specs.display,
        product.specs.battery,
        product.specs.camera,
        product.specs.os,
        product.price,
        product.specs.availability,
        product.specs.warranty
        
    ];

    specFields.forEach((dd, index) => {
        dd.textContent = specs[index];
    });

    const img = document.getElementById("product-image");
    img.src = product.img;
    img.style.display = "block";

    document.getElementById("back-button").addEventListener("click", () => {
        window.history.back();
    });

    document.getElementById("proceed-btn").addEventListener("click", () => {
    const specProduct = JSON.parse(localStorage.getItem("specProduct"));

    if (specProduct) {
        const checkoutProduct = {
            name: specProduct.name,
            img: specProduct.img,
            price: specProduct.price // ✅ Include price explicitly
        };

        localStorage.setItem("checkoutProduct", JSON.stringify(checkoutProduct));
        window.location.href = "checkout.html";
    }
});

}
// handles ordr now buttons
function handleOrderNowButtons() {
    const orderButtons = document.querySelectorAll(".order-btn");

    orderButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const product = btn.closest(".product1");
            const name = product.querySelector("h3").textContent.trim();
            const imgSrc = product.querySelector("img").getAttribute("src");
            const price = product.querySelector(".new-price").textContent.trim().replace("Ghs", "").replace("GHS", "").trim();

            const productDetails = {
                name,
                img: imgSrc,
                price
            };

            localStorage.setItem("checkoutProduct", JSON.stringify(productDetails));
            window.location.href = "checkout.html";
        });
    });
}

// to display the checkout product

function displayCheckoutProduct() {
    const product = JSON.parse(localStorage.getItem("checkoutProduct"));
    if (!product) return;

    const nameEl = document.getElementById("product-name");
    const priceEl = document.getElementById("product-price");
    const imgEl = document.getElementById("product-img");
    const totalEl = document.getElementById("total-price");
    const qtyInput = document.getElementById("product-quantity");

    // Display basic details
    nameEl.textContent = product.name;
    priceEl.textContent = parseFloat(product.price).toFixed(2);
    imgEl.src = product.img;

    // Calculate initial total
    updateTotal();

    // Listen for quantity change
    qtyInput.addEventListener("input", updateTotal);

    // Total calculation function
    function updateTotal() {
        const quantity = parseInt(qtyInput.value);
        const price = parseFloat(product.price);

        if (!isNaN(quantity) && quantity > 0) {
            const total = quantity * price;
            totalEl.textContent = total.toFixed(2);
        } else {
            totalEl.textContent = "0.00";
        }
    }

    // Back button
    document.getElementById("back-button").addEventListener("click", () => {
        window.history.back();
    });

    // Pay Now button
    document.getElementById("pay-now-btn").addEventListener("click", () => {
        alert("Redirecting to payment...");
        // Implement Paystack here
    });
}
