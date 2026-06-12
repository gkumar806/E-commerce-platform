<h1 align="center">MERN E-Commerce Platform</h1>

![alt text](<Screenshot 2026-06-12 135825.png>)

A full-stack E-Commerce web application built using the MERN stack that provides a seamless online shopping experience with secure authentication, product management, shopping cart functionality, coupon support, and Stripe payment integration.

Features:

# MERN E-Commerce Platform

A full-stack E-Commerce web application built using the MERN stack that provides a seamless online shopping experience with secure authentication, product management, shopping cart functionality, coupon support, and Stripe payment integration.

## Features

### User Features

* User Registration and Login
* JWT-based Authentication & Authorization
* Browse Products by Categories
* Featured Products Section
* Product Search and Filtering
* Shopping Cart Management
* Apply Discount Coupons
* Secure Stripe Checkout
* Order Creation and Management

### Admin Features

* Add New Products
* Manage Product Catalog
* Mark Products as Featured
* Monitor Orders and Transactions
* Analytics Dashboard

## Tech Stack

### Frontend

* React.js
* Zustand (State Management)
* Tailwind CSS
* Axios
* Framer Motion
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Additional Services

* Stripe Payment Gateway
* Redis Caching
* Cloudinary Image Storage
* JWT Authentication

## Key Functionalities

### Authentication

* Secure user signup and login
* JWT token-based authorization
* Protected routes for authenticated users

### Product Management

* Create, update, and manage products
* Product categorization
* Featured product functionality

### Shopping Cart

* Add products to cart
* Update product quantities
* Remove products from cart
* Real-time cart total calculation

### Payment Integration

* Stripe Checkout Session Integration
* Secure online payments
* Automatic order creation after successful payment

### Coupon System

* Coupon validation
* Discount calculations
* Dynamic pricing updates

## Database Collections

### Users

Stores user profile and authentication details.

### Products

Stores product information including:

* Name
* Description
* Price
* Category
* Image
* Featured Status

### Orders

Stores:

* User Information
* Purchased Products
* Order Amount
* Payment Session Details

