# Coffee Hub (Beta)

Coffee Hub is a modern e-commerce web application that demonstrates a **full card payment flow using CyberSource Unified Checkout**.  
The project showcases how a custom online store can securely accept card payments without redirecting users away from the site.

🔗 Live Demo: https://coffee-hub-beta.vercel.app/

---

## Overview

Coffee Hub is built as a sample online coffee store where users can:
- Browse products
- Add items to cart
- Complete payments using **CyberSource Unified Checkout**

The checkout experience is fully embedded using CyberSource’s JavaScript SDK

---

## Key Features

- Product listing and cart flow
- CyberSource **Unified Checkout** integration
- Secure card payment (no raw card data handled by merchant)
- Built with modern React / Next.js
- Responsive UI (desktop & mobile)
- Deployed on Vercel

---

## Payment Flow (Unified Checkout)

1. User proceeds to checkout
2. Backend generates a **Capture Context JWT** from CyberSource
3. Frontend loads CyberSource Unified Checkout JS
4. Secure payment form is rendered
5. User submits card details
6. CyberSource processes authorization / capture
7. Transaction result is returned to the merchant backend

> The merchant application never directly handles sensitive card information.

---

## Environment Variables
Create a `.env` file:

```env
CS_HOST=apitest.cybersource.com

CS_MERCHANT_ID=your_merchant_id
CS_KEY_ID=your_key_id
CS_SECRET_KEY=your_secret_key

SERVER_API_URL=server_url_call_to_generate_capture_context
```
**Never expose secret keys on the client side**

---
## Run Locally

```bash
npm install
npm run dev
```

## Test Payments (Sandbox)

Use the following CyberSource sandbox test cards for payment testing:

### Standard Test Cards
- **Visa:** `4111 1111 1111 1111`
- **Expiry Date:** Any future date
- **CVV:** Any 3 digits

### 3DS Challenge Test Cards
- **Visa (3DS Challenge):** `4456 5300 0000 1096`
- **Mastercard (3DS Challenge):** `5200 0000 0000 1096`

### Special Scenario
- **Visa (Special Test Case):** `4000 0000 0000 2503`

> All cards above are **sandbox-only** and will trigger specific authentication flows such as **3D Secure challenges**.

