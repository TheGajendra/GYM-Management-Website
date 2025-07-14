 // Product Data
        const products = [
            {
                id: 1,
                name: "Whey Protein Isolate",
                category: "Protein",
                description: "Ultra-pure protein powder with 25g protein per serving for muscle recovery and growth.",
                price: 49.99,
                image: "images/Whey.jpg"
            },
            {
                id: 2,
                name: "Pre-Workout Energizer",
                category: "Pre-Workout",
                description: "Powerful formula with caffeine, beta-alanine and creatine for explosive workouts.",
                price: 39.99,
                image: "images/Pre-Workout.jpg"
            },
            {
                id: 3,
                name: "BCAA Recovery",
                category: "Recovery",
                description: "Essential amino acids to reduce muscle soreness and accelerate recovery.",
                price: 29.99,
                image: "images/BCAA Recovery.jpg"
            },
            {
                id: 4,
                name: "Creatine Monohydrate",
                category: "Performance",
                description: "Pure creatine to increase strength, power and muscle mass.",
                price: 24.99,
                image: "images/Creatine Monohydrate.jpg"
            },
            {
                id: 5,
                name: "Multivitamin Complex",
                category: "Vitamins",
                description: "Complete multivitamin formula with essential vitamins and minerals for athletes.",
                price: 19.99,
                image: "images/Multivitamin Complex.jpg"
            },
            {
                id: 6,
                name: "Fat Burner",
                category: "Weight Loss",
                description: "Advanced thermogenic formula to boost metabolism and support fat loss.",
                price: 34.99,
                image: "images/Fat Burner.jpg"
            },
            {
                id: 7,
                name: "Mass Gainer",
                category: "Weight Gain",
                description: "High-calorie formula with proteins and carbs for healthy weight gain.",
                price: 54.99,
                image: "images/Mass Gainer.jpg"
            },
            {
                id: 8,
                name: "Glutamine Powder",
                category: "Recovery",
                description: "Supports muscle recovery, immune function and gut health.",
                price: 27.99,
                image: "images/Glutamine Powder.jpg"
            }
        ];

        // Cart state
        let cart = [];

        // DOM Elements
        const productsGrid = document.getElementById('productsGrid');
        const cartIcon = document.getElementById('cartIcon');
        const cartContainer = document.getElementById('cartContainer');
        const closeCart = document.getElementById('closeCart');
        const cartItems = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const overlay = document.getElementById('overlay');
        const cartCount = document.querySelector('.cart-count');

        // Initialize the page
        function init() {
            renderProducts();
            updateCartUI();
            
            // Event listeners
            cartIcon.addEventListener('click', openCart);
            closeCart.addEventListener('click', closeCartHandler);
            overlay.addEventListener('click', closeCartHandler);
            checkoutBtn.addEventListener('click', checkout);
        }

        // Render products to the page
        function renderProducts() {
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-actions">
                            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                `;
                
                productsGrid.appendChild(productCard);
            });
            
            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    addToCart(productId);
                });
            });
        }

        // Add item to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            
            if (!product) return;
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                });
            }
            
            updateCartUI();
            showCartNotification(product.name);
        }

        // Show notification when adding to cart
        function showCartNotification(productName) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <span>Added ${productName} to your cart</span>
                </div>
            `;
            
            // Add to body
            document.body.appendChild(notification);
            
            // Position notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'var(--success)';
            notification.style.color = 'white';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '5px';
            notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            notification.style.zIndex = '1000';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'all 0.3s';
            
            // Trigger animation
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Update cart UI
        function updateCartUI() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartTotal.textContent = '$0.00';
                return;
            }
            
            emptyCartMessage.style.display = 'none';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="https://images.unsplash.com/photo-1591262184853-9a7d6d722186?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Update cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners to cart item controls
            document.querySelectorAll('.minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    updateQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    updateQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('.remove-item').dataset.id);
                    removeFromCart(id);
                });
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const newQuantity = parseInt(e.target.value);
                    
                    if (newQuantity >= 1) {
                        setQuantity(id, newQuantity);
                    }
                });
            });
        }

        // Update item quantity
        function updateQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            
            if (item) {
                item.quantity += change;
                
                if (item.quantity < 1) {
                    removeFromCart(id);
                } else {
                    updateCartUI();
                }
            }
        }

        // Set item quantity
        function setQuantity(id, quantity) {
            const item = cart.find(item => item.id === id);
            
            if (item) {
                item.quantity = quantity;
                updateCartUI();
            }
        }

        // Remove item from cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }

        // Open cart
        function openCart() {
            cartContainer.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Close cart
        function closeCartHandler() {
            cartContainer.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Checkout process
        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // In a real application, this would redirect to a payment page
            alert(`Checkout complete! Total: ${cartTotal.textContent}\nThank you for your purchase!`);
            cart = [];
            updateCartUI();
            closeCartHandler();
        }

        // Initialize the page
        init();