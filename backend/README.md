# Kasma Organics Backend API

A complete backend API for the Kasma Organics e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- **Product Management**: CRUD operations for products with categories, weight options, and pricing
- **Order Management**: Complete order lifecycle with tracking and status updates
- **Payment Processing**: Support for COD, UPI, and card payments
- **User Management**: User registration, authentication, and profile management
- **Address Management**: Multiple shipping addresses with default selection
- **Search & Filtering**: Advanced product search and category filtering
- **Pagination**: Efficient data pagination for large datasets

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=8001
   DATABASE_URL=mongodb://localhost:27017/kasma_organics
   JWT_SECRET=kasma_organics_jwt_secret_key_2024
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. Make sure MongoDB is running on your system

5. Start the server:
   ```bash
   npm run dev
   ```

## Database Seeding

To populate the database with sample products:

```bash
npm run seed
```

To clear all product data:

```bash
npm run seed:destroy
```

## API Endpoints

### Products
- `GET /api/v1/products` - Get all products (with pagination, filtering, search)
- `GET /api/v1/products/:id` - Get single product by ID
- `GET /api/v1/products/category/:category` - Get products by category
- `GET /api/v1/products/search/:query` - Search products
- `POST /api/v1/products` - Create new product (Admin)
- `PATCH /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders` - Get all orders (with filtering)
- `GET /api/v1/orders/:id` - Get single order by ID
- `GET /api/v1/orders/order/:orderId` - Get order by Order ID
- `GET /api/v1/orders/track/:trackingId` - Track order by Tracking ID
- `GET /api/v1/orders/user/:userId` - Get user's orders
- `PATCH /api/v1/orders/:id/status` - Update order status
- `PATCH /api/v1/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/v1/payments` - Create new payment
- `POST /api/v1/payments/:paymentId/process` - Process payment
- `GET /api/v1/payments/:id` - Get payment by ID
- `GET /api/v1/payments/order/:orderId` - Get payments by order ID
- `GET /api/v1/payments` - Get all payments (Admin)
- `PATCH /api/v1/payments/:id/status` - Update payment status
- `POST /api/v1/payments/:paymentId/refund` - Refund payment

### Users
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/address` - Add address
- `PATCH /api/v1/users/address/:addressId` - Update address
- `DELETE /api/v1/users/address/:addressId` - Delete address

## Data Models

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: ['fruits', 'vegetables', 'powders', 'snacks', 'other'],
  weightOptions: [{
    weight: String,
    price: Number
  }],
  stock: Number,
  isActive: Boolean,
  tags: [String],
  rating: {
    average: Number,
    count: Number
  }
}
```

### Order
```javascript
{
  orderId: String,
  trackingId: String,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    weight: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  shippingAddress: Object,
  paymentMethod: ['cod', 'upi', 'card'],
  paymentStatus: ['pending', 'paid', 'failed', 'refunded'],
  orderStatus: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
  upiId: String,
  orderDate: Date,
  estimatedDelivery: Date
}
```

### Payment
```javascript
{
  orderId: ObjectId,
  paymentId: String,
  amount: Number,
  paymentMethod: ['cod', 'upi', 'card'],
  paymentStatus: ['pending', 'processing', 'completed', 'failed', 'refunded'],
  transactionId: String,
  upiId: String,
  paymentDate: Date,
  failureReason: String
}
```

### User
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  password: String,
  addresses: [{
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  isActive: Boolean,
  role: ['user', 'admin']
}
```

## Error Handling

The API includes comprehensive error handling with:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)

## Development

The server runs in development mode by default with detailed error logging and stack traces.

## Production

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production MongoDB database
3. Implement proper logging
4. Add rate limiting
5. Set up monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC
