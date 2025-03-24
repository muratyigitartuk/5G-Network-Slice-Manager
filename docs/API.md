# API Documentation

This document provides detailed information about the APIs used in the Network Slicing Management Platform.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Network Slices API](#network-slices-api)
- [Analytics API](#analytics-api)
- [User Management API](#user-management-api)
- [Compliance API](#compliance-api)
- [Error Handling](#error-handling)

## Overview

The Network Slicing Management Platform uses a RESTful API architecture. All API endpoints return JSON responses and accept JSON payloads for POST and PUT requests.

Base URL: `https://api.networkslicing.example.com/v1`

## Authentication

All API requests require authentication using JWT tokens.

### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "username": "admin",
    "role": "admin"
  }
}
```

### Authentication Headers

Include the JWT token in the Authorization header for all API requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Network Slices API

### Get All Slices

```
GET /slices
```

**Response:**

```json
{
  "slices": [
    {
      "id": "slice-1",
      "name": "eMBB Slice",
      "type": "eMBB",
      "status": "active",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-02T00:00:00Z"
    },
    {
      "id": "slice-2",
      "name": "URLLC Slice",
      "type": "URLLC",
      "status": "inactive",
      "createdAt": "2023-01-03T00:00:00Z",
      "updatedAt": "2023-01-04T00:00:00Z"
    }
  ]
}
```

### Get Slice by ID

```
GET /slices/{sliceId}
```

**Response:**

```json
{
  "id": "slice-1",
  "name": "eMBB Slice",
  "type": "eMBB",
  "status": "active",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z",
  "configuration": {
    "bandwidth": 100,
    "latency": 10,
    "reliability": 99.9
  },
  "resources": {
    "cpu": 4,
    "memory": 8,
    "storage": 100
  }
}
```

### Create Slice

```
POST /slices
```

**Request Body:**

```json
{
  "name": "New Slice",
  "type": "eMBB",
  "configuration": {
    "bandwidth": 100,
    "latency": 10,
    "reliability": 99.9
  },
  "resources": {
    "cpu": 4,
    "memory": 8,
    "storage": 100
  }
}
```

**Response:**

```json
{
  "id": "slice-3",
  "name": "New Slice",
  "type": "eMBB",
  "status": "creating",
  "createdAt": "2023-01-05T00:00:00Z",
  "updatedAt": "2023-01-05T00:00:00Z",
  "configuration": {
    "bandwidth": 100,
    "latency": 10,
    "reliability": 99.9
  },
  "resources": {
    "cpu": 4,
    "memory": 8,
    "storage": 100
  }
}
```

### Update Slice

```
PUT /slices/{sliceId}
```

**Request Body:**

```json
{
  "name": "Updated Slice",
  "configuration": {
    "bandwidth": 200,
    "latency": 5,
    "reliability": 99.99
  }
}
```

**Response:**

```json
{
  "id": "slice-1",
  "name": "Updated Slice",
  "type": "eMBB",
  "status": "updating",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-06T00:00:00Z",
  "configuration": {
    "bandwidth": 200,
    "latency": 5,
    "reliability": 99.99
  },
  "resources": {
    "cpu": 4,
    "memory": 8,
    "storage": 100
  }
}
```

### Delete Slice

```
DELETE /slices/{sliceId}
```

**Response:**

```json
{
  "message": "Slice deletion initiated",
  "id": "slice-1",
  "status": "deleting"
}
```

## Analytics API

### Get Slice Performance Metrics

```
GET /analytics/slices/{sliceId}/metrics
```

**Query Parameters:**

- `timeframe`: The timeframe for the metrics (e.g., `1h`, `24h`, `7d`, `30d`)
- `metrics`: Comma-separated list of metrics to retrieve (e.g., `bandwidth,latency,packetLoss`)

**Response:**

```json
{
  "sliceId": "slice-1",
  "timeframe": "24h",
  "metrics": {
    "bandwidth": [
      {
        "timestamp": "2023-01-05T00:00:00Z",
        "value": 95.5
      },
      {
        "timestamp": "2023-01-05T01:00:00Z",
        "value": 97.2
      }
    ],
    "latency": [
      {
        "timestamp": "2023-01-05T00:00:00Z",
        "value": 8.3
      },
      {
        "timestamp": "2023-01-05T01:00:00Z",
        "value": 7.9
      }
    ]
  }
}
```

### Get System-wide Analytics

```
GET /analytics/system
```

**Query Parameters:**

- `timeframe`: The timeframe for the analytics (e.g., `1h`, `24h`, `7d`, `30d`)

**Response:**

```json
{
  "timeframe": "24h",
  "resourceUtilization": {
    "cpu": {
      "average": 65.3,
      "peak": 82.1
    },
    "memory": {
      "average": 72.8,
      "peak": 88.5
    },
    "storage": {
      "average": 45.2,
      "peak": 47.3
    }
  },
  "sliceCount": {
    "total": 10,
    "active": 8,
    "inactive": 1,
    "error": 1
  },
  "performance": {
    "averageLatency": 12.3,
    "packetLoss": 0.05,
    "throughput": 850.2
  }
}
```

## User Management API

### Get All Users

```
GET /users
```

**Response:**

```json
{
  "users": [
    {
      "id": "user-1",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": "user-2",
      "username": "operator",
      "email": "operator@example.com",
      "role": "operator",
      "createdAt": "2023-01-02T00:00:00Z"
    }
  ]
}
```

### Get User by ID

```
GET /users/{userId}
```

**Response:**

```json
{
  "id": "user-1",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "2023-01-01T00:00:00Z",
  "lastLogin": "2023-01-05T00:00:00Z",
  "permissions": [
    "read:slices",
    "write:slices",
    "delete:slices",
    "read:users",
    "write:users",
    "delete:users"
  ]
}
```

### Create User

```
POST /users
```

**Request Body:**

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "viewer"
}
```

**Response:**

```json
{
  "id": "user-3",
  "username": "newuser",
  "email": "newuser@example.com",
  "role": "viewer",
  "createdAt": "2023-01-06T00:00:00Z",
  "permissions": [
    "read:slices"
  ]
}
```

### Update User

```
PUT /users/{userId}
```

**Request Body:**

```json
{
  "email": "updated@example.com",
  "role": "operator"
}
```

**Response:**

```json
{
  "id": "user-3",
  "username": "newuser",
  "email": "updated@example.com",
  "role": "operator",
  "createdAt": "2023-01-06T00:00:00Z",
  "updatedAt": "2023-01-07T00:00:00Z",
  "permissions": [
    "read:slices",
    "write:slices"
  ]
}
```

### Delete User

```
DELETE /users/{userId}
```

**Response:**

```json
{
  "message": "User deleted successfully",
  "id": "user-3"
}
```

## Compliance API

### Get Compliance Reports

```
GET /compliance/reports
```

**Query Parameters:**

- `timeframe`: The timeframe for the reports (e.g., `7d`, `30d`, `90d`)

**Response:**

```json
{
  "reports": [
    {
      "id": "report-1",
      "name": "Monthly Compliance Report",
      "status": "completed",
      "createdAt": "2023-01-01T00:00:00Z",
      "completedAt": "2023-01-01T01:00:00Z",
      "downloadUrl": "https://api.networkslicing.example.com/v1/compliance/reports/report-1/download"
    },
    {
      "id": "report-2",
      "name": "Weekly Compliance Report",
      "status": "completed",
      "createdAt": "2023-01-07T00:00:00Z",
      "completedAt": "2023-01-07T01:00:00Z",
      "downloadUrl": "https://api.networkslicing.example.com/v1/compliance/reports/report-2/download"
    }
  ]
}
```

### Generate Compliance Report

```
POST /compliance/reports
```

**Request Body:**

```json
{
  "name": "Custom Compliance Report",
  "timeframe": "30d",
  "includeSlices": ["slice-1", "slice-2"],
  "format": "pdf"
}
```

**Response:**

```json
{
  "id": "report-3",
  "name": "Custom Compliance Report",
  "status": "generating",
  "createdAt": "2023-01-08T00:00:00Z",
  "estimatedCompletionTime": "2023-01-08T00:05:00Z"
}
```

### Get Compliance Rules

```
GET /compliance/rules
```

**Response:**

```json
{
  "rules": [
    {
      "id": "rule-1",
      "name": "Latency Requirement",
      "description": "Latency must be below 10ms for URLLC slices",
      "severity": "critical",
      "category": "performance"
    },
    {
      "id": "rule-2",
      "name": "Bandwidth Allocation",
      "description": "Bandwidth must be at least 100Mbps for eMBB slices",
      "severity": "major",
      "category": "resource"
    }
  ]
}
```

## Error Handling

All API endpoints return standard HTTP status codes to indicate success or failure. In case of an error, the response body will contain additional information about the error.

### Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": "Slice with ID 'slice-999' does not exist"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication is required or has failed
- `FORBIDDEN`: The authenticated user does not have permission to access the resource
- `RESOURCE_NOT_FOUND`: The requested resource was not found
- `VALIDATION_ERROR`: The request payload failed validation
- `INTERNAL_SERVER_ERROR`: An unexpected error occurred on the server

### HTTP Status Codes

- `200 OK`: The request was successful
- `201 Created`: The resource was created successfully
- `204 No Content`: The request was successful but there is no content to return
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required or has failed
- `403 Forbidden`: The authenticated user does not have permission to access the resource
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An unexpected error occurred on the server 