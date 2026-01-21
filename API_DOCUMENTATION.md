# Dry Cleaning & Laundry Service API Documentation

## Overview

This API manages a dry cleaning and laundry service business with multiple branches. It handles customers, services (rate card), orders, and provides analytics for branch revenue and service statistics.

## Base URL

- Local: `http://localhost:3000/api/v1`
- Production: `http://your-domain.com/v1`

## Authentication

Most endpoints are public for customer convenience. Admin/staff endpoints require JWT authentication with appropriate roles:
- `admin`: Full access
- `staff`: Limited access (view orders, update status)

## API Endpoints

### Branches

#### Get All Branches
```
GET /branches
```
**Description**: Get list of all active branches  
**Auth**: Public  
**Response**:
```json
{
  "branches": [
    {
      "id": "uuid",
      "name": "Branch Name",
      "address": "123 Main St",
      "phone": "+1234567890",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Branch by ID
```
GET /branches/:id
```
**Description**: Get specific branch details  
**Auth**: Public

#### Create Branch
```
POST /branches
```
**Auth**: Admin  
**Body**:
```json
{
  "name": "Branch Name",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

#### Update Branch
```
PUT /branches/:id
```
**Auth**: Admin  
**Body**:
```json
{
  "name": "Updated Name",
  "address": "Updated Address",
  "phone": "+1234567890",
  "isActive": true
}
```

#### Delete Branch (Soft Delete)
```
DELETE /branches/:id
```
**Auth**: Admin

---

### Customers

#### Get All Customers
```
GET /customers
```
**Description**: Get list of all customers  
**Auth**: Admin, Staff

#### Get Customer by Phone
```
GET /customers/phone/:phone
```
**Description**: Get customer by phone number  
**Auth**: Public  
**Example**: `/customers/phone/+1234567890`

#### Get Customer by ID
```
GET /customers/:id
```
**Auth**: Admin, Staff

#### Get Customer Service History
```
GET /customers/phone/:phone/history
```
**Description**: Get all orders for a customer by phone number  
**Auth**: Public  
**Response**:
```json
{
  "orders": [
    {
      "id": "uuid",
      "customerId": "uuid",
      "branchId": "uuid",
      "totalAmount": "150.00",
      "status": "completed",
      "items": [...],
      "customer": {...},
      "branch": {...},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 5
}
```

#### Update Customer
```
PUT /customers/:id
```
**Auth**: Admin, Staff  
**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St"
}
```

---

### Services (Rate Card)

#### Get All Services
```
GET /services
```
**Description**: Get all active services with prices  
**Auth**: Public  
**Response**:
```json
{
  "services": [
    {
      "id": "uuid",
      "name": "Dry Cleaning",
      "price": "25.00",
      "description": "Professional dry cleaning service",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Service by ID
```
GET /services/:id
```
**Auth**: Public

#### Create Service
```
POST /services
```
**Auth**: Admin  
**Body**:
```json
{
  "name": "Dry Cleaning",
  "price": 25.00,
  "description": "Professional dry cleaning service"
}
```

#### Update Service
```
PUT /services/:id
```
**Auth**: Admin  
**Body**:
```json
{
  "name": "Updated Name",
  "price": 30.00,
  "description": "Updated description",
  "isActive": true
}
```

#### Delete Service (Soft Delete)
```
DELETE /services/:id
```
**Auth**: Admin

---

### Orders

#### Create Order
```
POST /orders
```
**Description**: Create a new service order. Customer is automatically created/updated if phone number exists.  
**Auth**: Public  
**Body**:
```json
{
  "customerPhone": "+1234567890",
  "branchId": "uuid",
  "items": [
    {
      "serviceId": "uuid",
      "quantity": 2,
      "description": "2 suits"
    },
    {
      "serviceId": "uuid",
      "quantity": 1,
      "description": "1 dress"
    }
  ],
  "notes": "Handle with care",
  "customerData": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St"
  }
}
```
**Response**:
```json
{
  "order": {
    "id": "uuid",
    "customerId": "uuid",
    "branchId": "uuid",
    "totalAmount": "75.00",
    "status": "pending",
    "items": [
      {
        "id": "uuid",
        "serviceId": "uuid",
        "quantity": 2,
        "unitPrice": "25.00",
        "totalPrice": "50.00",
        "service": {
          "name": "Dry Cleaning",
          "price": "25.00"
        }
      }
    ],
    "customer": {...},
    "branch": {...},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get All Orders
```
GET /orders?branchId=uuid&status=pending
```
**Description**: Get all orders with optional filters  
**Auth**: Admin, Staff  
**Query Parameters**:
- `branchId` (optional): Filter by branch
- `status` (optional): Filter by status (`pending`, `in_progress`, `ready`, `completed`, `cancelled`)

#### Get Order by ID
```
GET /orders/:id
```
**Auth**: Public

#### Update Order Status
```
PUT /orders/:id/status
```
**Auth**: Admin, Staff  
**Body**:
```json
{
  "status": "in_progress"
}
```
**Valid Statuses**: `pending`, `in_progress`, `ready`, `completed`, `cancelled`

#### Get Branch Revenue
```
GET /branches/:branchId/revenue?startDate=2024-01-01&endDate=2024-12-31
```
**Description**: Get revenue statistics for a branch  
**Auth**: Admin, Staff  
**Query Parameters**:
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

**Response**:
```json
{
  "revenue": {
    "totalRevenue": 15000.00,
    "orderCount": 150
  }
}
```

#### Get Branch Service Statistics
```
GET /branches/:branchId/service-stats
```
**Description**: Get statistics for each service at a branch  
**Auth**: Admin, Staff  
**Response**:
```json
{
  "stats": [
    {
      "serviceName": "Dry Cleaning",
      "count": 50,
      "revenue": 1250.00
    },
    {
      "serviceName": "Washing",
      "count": 30,
      "revenue": 450.00
    }
  ]
}
```

---

## Order Status Flow

1. **pending**: Order created, waiting to be processed
2. **in_progress**: Order is being processed
3. **ready**: Order is ready for pickup
4. **completed**: Order picked up by customer
5. **cancelled**: Order cancelled

---

## Business Logic

### Customer Management
- Customers are uniquely identified by phone number
- If a customer doesn't exist when creating an order, they are automatically created
- Customer information can be updated when creating an order via `customerData`

### Order Calculation
- Total order amount is automatically calculated from service prices and quantities
- Each order item stores the unit price at the time of order creation (price snapshot)
- Total = sum of (unitPrice × quantity) for all items

### Branch Analytics
- Revenue statistics only count completed orders
- Service statistics show count and revenue per service for completed orders

---

## Example Workflow

1. **Setup** (Admin):
   - Create branches: `POST /branches`
   - Create services: `POST /services`

2. **Customer Visit**:
   - Customer brings clothes
   - Create order: `POST /orders` with customer phone and items
   - System automatically creates/updates customer

3. **Order Processing** (Staff):
   - Update status: `PUT /orders/:id/status` → `in_progress`
   - Update status: `PUT /orders/:id/status` → `ready`
   - Update status: `PUT /orders/:id/status` → `completed` (after pickup)

4. **Analytics** (Admin/Staff):
   - View branch revenue: `GET /branches/:branchId/revenue`
   - View service stats: `GET /branches/:branchId/service-stats`
   - View customer history: `GET /customers/phone/:phone/history`

---

## Error Responses

All errors follow this format:
```json
{
  "error_code": 400,
  "error_message": "Error description"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## Database Schema

### Entities
- **Branch**: Stores branch information
- **Customer**: Stores customer information (unique by phone)
- **Service**: Stores service rate card (name + price)
- **Order**: Stores order information (links customer + branch)
- **OrderItem**: Stores individual items in an order (links order + service)

### Relationships
- Customer → Orders (One-to-Many)
- Branch → Orders (One-to-Many)
- Order → OrderItems (One-to-Many)
- Service → OrderItems (One-to-Many)

---

## Next Steps

1. **Run Migrations**: Generate and run database migrations
   ```bash
   npm run migration:generate -- --name=InitialDryCleaningSchema
   npm run migration:run
   ```

2. **Seed Data**: Create initial branches and services
   - Use `POST /branches` to create your 2 branches
   - Use `POST /services` to create your service rate card

3. **Test API**: Use Swagger UI at `/api/docs` (local) or `/docs` (production)

4. **Configure Authentication**: Set up JWT tokens for admin/staff endpoints if needed
