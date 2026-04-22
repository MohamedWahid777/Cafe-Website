/* ============================================================
   ROAST & RITUAL — menu-filter.js  v2.0
   Menu filter · Shopping cart · EmailJS orders · FAQ · Counter
   ============================================================ */
(function () {
  "use strict";

  /* ════════════════════════════════════════
     MENU FILTER
  ════════════════════════════════════════ */
  function initMenuFilter() {
    var filterBtns = document.querySelectorAll("[data-filter]");
    var menuCards = document.querySelectorAll("[data-category]");
    if (!filterBtns.length || !menuCards.length) return;

    function setActive(btn) {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
    }

    function filterCards(cat) {
      menuCards.forEach(function (card) {
        var show = cat === "all" || card.getAttribute("data-category") === cat;
        card.style.display = show ? "" : "none";
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActive(btn);
        filterCards(btn.getAttribute("data-filter"));
      });
    });

    // Init: show all
    filterCards("all");
  }

  /* ════════════════════════════════════════
     CART STATE
  ════════════════════════════════════════ */
  var cart = [];

  function addToCart(name, nameAr, price) {
    var existing = cart.find(function (i) {
      return i.name === name;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name: name, nameAr: nameAr, price: price, qty: 1 });
    }
    updateCartUI();
    openCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
  }
  // Expose for inline HTML onclick
  window.removeFromCart = removeFromCart;

  function updateCartUI() {
    var countEl = document.getElementById("cart-count");
    var itemsEl = document.getElementById("cart-items");
    var emptyEl = document.getElementById("cart-empty");
    var footerEl = document.getElementById("cart-footer");
    var totalEl = document.getElementById("cart-total");
    if (!countEl) return;

    var totalQty = cart.reduce(function (s, i) {
      return s + i.qty;
    }, 0);
    countEl.textContent = totalQty;

    var isAr = document.documentElement.lang === "ar";

    if (cart.length === 0) {
      if (emptyEl) emptyEl.style.display = "block";
      if (footerEl) footerEl.classList.add("hidden");
      if (itemsEl) {
        itemsEl.innerHTML = "";
        if (emptyEl) itemsEl.appendChild(emptyEl);
      }
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (footerEl) footerEl.classList.remove("hidden");

    if (itemsEl) {
      itemsEl.innerHTML = "";
      var total = 0;
      cart.forEach(function (item, idx) {
        total += item.price * item.qty;
        var div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML =
          '<div class="cart-item-info">' +
          '  <div class="cart-item-name">' +
          (isAr ? item.nameAr : item.name) +
          "</div>" +
          '  <div class="cart-item-price">ج.م ' +
          item.price +
          " × " +
          item.qty +
          "</div>" +
          "</div>" +
          '<button class="cart-item-remove material-symbols-outlined" ' +
          '        onclick="removeFromCart(' +
          idx +
          ')" aria-label="Remove item">delete</button>';
        itemsEl.appendChild(div);
      });

      if (totalEl) totalEl.textContent = "ج.م " + total;
    }
  }

  function openCart() {
    var drawer = document.getElementById("cart-drawer");
    var overlay = document.getElementById("cart-overlay");
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    var drawer = document.getElementById("cart-drawer");
    var overlay = document.getElementById("cart-overlay");
    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  /* ════════════════════════════════════════
     PLACE ORDER via EmailJS
  ════════════════════════════════════════ */
  function initPlaceOrder() {
    var btn = document.getElementById("place-order-btn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const name = document.getElementById("order-name").value.trim();
      const phone = document.getElementById("order-phone").value.trim();
      const notes = document.getElementById("order-notes").value.trim();
      const isAr = document.documentElement.lang === "ar";

      if (!name || !phone) {
        alert(
          isAr
            ? "من فضلك أدخل اسمك ورقم هاتفك"
            : "Please enter your name and phone number.",
        );
        return;
      }
      if (!cart || cart.length === 0) return;

      const orderLines = cart
        .map(
          (i) =>
            `• ${i.name} (${i.nameAr || i.name}) × ${i.qty} — ج.م ${i.price * i.qty}`,
        )
        .join("\n");

      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

      const params = {
        to_email: "wahadmomo@gmail.com",
        type: "Menu Order — طلب قائمة",
        from_name: name,
        phone: phone,
        email: "N/A",
        order_items: orderLines,
        total: "ج.م " + total,
        date: "N/A",
        time: "N/A",
        guests: "N/A",
        notes: notes || "لا يوجد",
        booking_time: new Date().toLocaleString("ar-EG"),
      };

      const button = this;
      button.disabled = true;
      button.textContent = "⏳";

      if (typeof emailjs !== "undefined") {
        emailjs
          .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
          .then(() => {
            cart.length = 0;
            updateCartUI();
            closeCart();
            showSuccessToast(
              isAr
                ? "تم إرسال طلبك! سنتواصل معك قريباً ☕"
                : "Order sent! We'll contact you shortly ☕",
            );
          })
          .catch((err) => {
            console.error(err);
            alert(
              isAr
                ? "فشل الإرسال، حاول مرة أخرى"
                : "Send failed, please try again.",
            );
          })
          .finally(() => {
            button.disabled = false;
            button.textContent = isAr ? "تأكيد الطلب" : "Place Order";
          });
      } else {
        alert(isAr ? "لم يتم تكوين EmailJS" : "EmailJS is not configured");
        button.disabled = false;
        button.textContent = isAr ? "تأكيد الطلب" : "Place Order";
      }
    });
  }

  /* ════════════════════════════════════════
     INIT CART (wire FAB, overlay, drawer)
  ════════════════════════════════════════ */
  function initCart() {
    var cartBtn = document.getElementById("cart-btn");
    var closeBtn = document.getElementById("close-cart");
    var overlay = document.getElementById("cart-overlay");

    if (!cartBtn) return; // not on menu page

    cartBtn.addEventListener("click", openCart);
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
    if (overlay) overlay.addEventListener("click", closeCart);

    // Wire add-to-cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name =
          btn.getAttribute("data-name") ||
          btn.closest("article").querySelector("h3").textContent;
        var nameAr = btn.getAttribute("data-name-ar") || name;
        var price = parseInt(btn.getAttribute("data-price"), 10) || 0;
        addToCart(name, nameAr, price);
      });
    });

    updateCartUI();
    initPlaceOrder();

    // Check if auto-add item exists from Home Featured Drinks
    var autoAddStr = localStorage.getItem("bs_auto_add");
    if (autoAddStr) {
      try {
        var autoAdd = JSON.parse(autoAddStr);
        if (autoAdd && autoAdd.name && autoAdd.price) {
          addToCart(autoAdd.name, autoAdd.nameAr, parseInt(autoAdd.price, 10));
          if (window.showSuccessToast) {
            var isAr = document.documentElement.lang === "ar";
            window.showSuccessToast(
              isAr
                ? "تم أضافة المشروب للقائمة"
                : autoAdd.name + " added to cart",
            );
          }
        }
      } catch (e) {
        // ignore JSON err
      }
      localStorage.removeItem("bs_auto_add");
    }
  }

  /* ════════════════════════════════════════
     GUEST COUNTER (reservation page)
  ════════════════════════════════════════ */
  function initGuestCounter() {
    var dec = document.getElementById("guests-decrease");
    var inc = document.getElementById("guests-increase");
    var disp = document.getElementById("guest-count");
    var input = document.getElementById("res-guests");
    if (!dec || !inc || !disp) return;

    var count = parseInt(disp.textContent, 10) || 2;
    function update() {
      disp.textContent = count;
      if (input) input.value = count;
    }
    update();

    dec.addEventListener("click", function () {
      if (count > 1) {
        count--;
        update();
      }
    });
    inc.addEventListener("click", function () {
      if (count < 20) {
        count++;
        update();
      }
    });
  }

  /* ════════════════════════════════════════
     FAQ ACCORDION
  ════════════════════════════════════════ */
  function initFAQAccordion() {
    var items = document.querySelectorAll("[data-faq-item]");
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector("[data-faq-trigger]");
      var content = item.querySelector("[data-faq-content]");
      var icon = item.querySelector("[data-faq-icon]");
      if (!trigger || !content) return;

      content.style.display = "none";

      trigger.addEventListener("click", function () {
        var isOpen = content.style.display !== "none";
        // Close all
        items.forEach(function (other) {
          var oc = other.querySelector("[data-faq-content]");
          var oi = other.querySelector("[data-faq-icon]");
          if (oc) oc.style.display = "none";
          if (oi) oi.style.transform = "";
          oi && (oi.style.transition = "transform 0.3s ease");
        });
        // Open this one
        if (!isOpen) {
          content.style.display = "block";
          if (icon) {
            icon.style.transform = "rotate(180deg)";
          }
        }
      });
    });

    // Open first by default
    var first = items[0];
    if (first) {
      var fc = first.querySelector("[data-faq-content]");
      var fi = first.querySelector("[data-faq-icon]");
      if (fc) fc.style.display = "block";
      if (fi) fi.style.transform = "rotate(180deg)";
    }
  }

  /* ════════════════════════════════════════
     DOM READY
  ════════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", function () {
    initMenuFilter();
    initCart();
    initGuestCounter();
    initFAQAccordion();
  });
})();
