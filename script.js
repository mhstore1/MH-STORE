 // إظهار زر الرجوع للأعلى عند التمرير
        const scrollBtn = document.getElementById('scrollTopBtn');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        
        // تمرير ناعم للأعلى عند الضغط
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    
        // إدارة القائمة المنبثقة للهواتف
        const burgerMenu = document.getElementById('burgerMenu');
        const burgerIcon = document.getElementById('burgerIcon');
        const mobileMenu = document.getElementById('mobileMenu');
        let menuOpen = false;
        
        burgerMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuOpen = !menuOpen;
            
            if (menuOpen) {
                burgerIcon.classList.remove('fa-bars');
                burgerIcon.classList.add('fa-times');
            } else {
                burgerIcon.classList.remove('fa-times');
                burgerIcon.classList.add('fa-bars');
            }
        });
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                burgerIcon.classList.remove('fa-times');
                burgerIcon.classList.add('fa-bars');
                menuOpen = false;
            });
        });
        
        // إدارة سلة التسوق
        let cart = [];
        const cartIcon = document.getElementById('cartIcon');
        const cartModal = document.getElementById('cartModal');
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutModal = document.getElementById('checkoutModal');
        
        // فتح سلة التسوق
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            updateCartDisplay();
        });
        
        // إغلاق سلة التسوق
        function closeCartModal() {
            cartModal.style.display = 'none';
        }
        
        // فتح نافذة تأكيد الطلب
        function openCheckoutModal() {
            if (cart.length === 0) {
                alert('سلة التسوق فارغة، أضف منتجات أولاً');
                return;
            }
            
            closeCartModal();
            checkoutModal.style.display = 'flex';
        }
        
        // إغلاق نافذة تأكيد الطلب
        function closeCheckoutModal() {
            checkoutModal.style.display = 'none';
        }
        
        // إضافة منتج إلى السلة
        function addToCart(name, price, image) {
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCartCount();
            showNotification('تمت إضافة المنتج إلى السلة');
        }
        
        // تحديث عدد العناصر في السلة
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        // تحديث عرض سلة التسوق
        function updateCartDisplay() {
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>سلة التسوق فارغة</p>
                    </div>
                `;
                cartTotal.textContent = '0 د.م';
                return;
            }
            
            let itemsHTML = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                itemsHTML += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>${item.price} د.م</p>
                            </div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                            <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = itemsHTML;
            cartTotal.textContent = `${total} د.م`;
        }
        
        // تغيير كمية المنتج
        function changeQuantity(index, change) {
            cart[index].quantity += change;
            
            if (cart[index].quantity < 1) {
                cart[index].quantity = 1;
            }
            
            updateCartCount();
            updateCartDisplay();
        }
        
        // تحديث كمية المنتج
        function updateQuantity(index, value) {
            const quantity = parseInt(value);
            
            if (isNaN(quantity) || quantity < 1) {
                cart[index].quantity = 1;
            } else {
                cart[index].quantity = quantity;
            }
            
            updateCartCount();
            updateCartDisplay();
        }
        
        // إزالة منتج من السلة
        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartCount();
            updateCartDisplay();
        }
        
        // إتمام عملية الشراء
        document.getElementById('checkoutForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('customerName').value;
            const phone = document.getElementById('customerPhone').value;
            const address = document.getElementById('customerAddress').value;
            const notes = document.getElementById('customerNotes').value;
            
            let message = 'طلب جديد من MH STORE\n--------------------------\n';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `${item.name} - ${item.quantity} × ${item.price} د.م = ${itemTotal} د.م\n`;
            });
            
            message += `--------------------------\nالمجموع: ${total} د.م\n\n`;
            message += `معلومات العميل:\nالاسم: ${name}\nالهاتف: ${phone}\nالعنوان: ${address}\n`;
            
            if (notes) {
                message += `ملاحظات: ${notes}\n`;
            }
            
            message += '\nشكراً لكم على ثقتكم في متجرنا!';
            
            const whatsappURL = `https://wa.me/212712825177?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');
            
            // تفريغ السلة بعد إتمام الطلب
            cart = [];
            updateCartCount();
            closeCheckoutModal();
            this.reset();
            
            showNotification('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.');
        });
        
        // إظهار إشعار
        function showNotification(message) {
            // يمكنك إضافة كود لإظهار إشعار هنا
            alert(message);
        }
        
        // إرسال نموذج الاتصال
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            const fullMessage = `
رسالة تواصل من MH STORE
--------------------------
اسم المرسل: ${name}
رقم الهاتف: ${phone}
الرسالة: ${message}
            `.trim();
            
            const whatsappURL = `https://wa.me/212637040284?text=${encodeURIComponent(fullMessage)}`;
            window.open(whatsappURL, '_blank');
            
            // تفريغ الحقول
            this.reset();
            
             alert("شكراً لتواصلكم، سيتم فتح الواتساب للرد عليكم في اسرع وقت ");
        });