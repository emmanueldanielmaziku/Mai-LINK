# Mai-LINK API Documentation

Base URL (Production): `https://mai-link-production.up.railway.app`

## Overview

This API has two route groups:

- `https://mai-link-production.up.railway.app/v1/api` for auth, link, and lipa endpoints.
- `https://mai-link-production.up.railway.app` for payment-link verification endpoint.

Content type for request bodies: `application/json`.

---

## Authentication

`/v1/api/link/*` endpoints require Bearer JWT.

Header format:

`Authorization: Bearer <token>`

Token is returned by signup/signin.

---

## 1) Sign Up Business

**Endpoint**  
`POST https://mai-link-production.up.railway.app/v1/api/auth/signup`

**Body**
```json
{
  "business_name": "My Shop",
  "business_number": 123456789,
  "business_network": "vodacom",
  "business_code": 1234
}
```

**Validation rules**
- `business_name`: string required
- `business_number`: number required
- `business_network`: string required
- `business_code`: number required

**Success (201)**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "businessName": "My Shop",
    "businessNumber": "123456789",
    "businessNetwork": "vodacom",
    "createdAt": "2026-04-15T08:00:00.000Z",
    "updatedAt": "2026-04-15T08:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Fail - Validation (400)**
```json
{
  "success": false,
  "errors": [
    {
      "field": "business_name",
      "message": "Expected string, received number"
    }
  ]
}
```

**Fail - Conflict (409)**
```json
{
  "success": false,
  "error": "Oops 🙊, Business already exist!"
}
```

---

## 2) Sign In Business

**Endpoint**  
`POST https://mai-link-production.up.railway.app/v1/api/auth/signin`

**Body**
```json
{
  "business_number": 123456789,
  "business_code": 1234
}
```

**Validation rules**
- `business_number`: number required
- `business_code`: number required

**Success (201)**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "businessName": "My Shop",
    "businessNumber": "123456789",
    "businessNetwork": "vodacom",
    "createdAt": "2026-04-15T08:00:00.000Z",
    "updatedAt": "2026-04-15T08:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Fail - Validation (400)**
```json
{
  "success": false,
  "errors": [
    {
      "field": "business_code",
      "message": "Expected number, received string"
    }
  ]
}
```

**Fail - Conflict (409)**
```json
{
  "success": false,
  "error": "Oops 🙊, Lipa number doesn't exist!"
}
```

or

```json
{
  "success": false,
  "error": "Oops 🙊, Wrong Credentials!"
}
```

---

## 3) Generate Payment Link (Protected)

**Endpoint**  
`POST https://mai-link-production.up.railway.app/v1/api/link/generate`

**Headers**
- `Authorization: Bearer <jwt_token>` (required)
- `Idempotency-Key: <unique_key>` (required)

**Body**
```json
{
  "amount": 5000
}
```

**Validation rules**
- `amount`: number required

**Success (201)**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 5000,
    "businessId": "business_uuid",
    "status": "PENDING",
    "code": "ABCDEFGH",
    "idempotencyKey": "client-generated-key",
    "createdAt": "2026-04-15T08:00:00.000Z",
    "updatedAt": "2026-04-15T08:00:00.000Z"
  }
}
```

**Fail - Missing Idempotency-Key (400)**
```json
{
  "success": false,
  "error": "⚠️ Oops! Idempotency-Key header is required"
}
```

**Fail - Validation (409)**
```json
{
  "status": false,
  "errors": [
    {
      "field": "amount",
      "message": "Expected number, received string"
    }
  ]
}
```

**Fail - Conflict (409)**
```json
{
  "success": false,
  "error": "⚠️ Duplicated request!"
}
```

or

```json
{
  "success": false,
  "error": "⚠️ Duplicated link!"
}
```

or

```json
{
  "success": false,
  "error": "⚠️ Failed to generate payment link"
}
```

**Fail - Unauthorized JWT (401)**
- Invalid/missing bearer token is handled by Hono JWT middleware.
- Typical middleware response is unauthorized JSON from middleware (not custom-defined in route).

---

## 4) Add Lipa Number

**Endpoint**  
`POST https://mai-link-production.up.railway.app/v1/api/lipa`

**Body**
```json
{
  "lipa_name": "Store A",
  "lipa_number": 123456,
  "lipa_network": "tigopesa"
}
```

**Validation rules**
- `lipa_name`: string required
- `lipa_number`: number required
- `lipa_network`: string required

**Success (200)**
```json
{
  "success": true,
  "result": {
    "id": "uuid",
    "businessName": "Store A",
    "businessNumber": 123456,
    "network": "tigopesa"
  }
}
```

**Fail - Validation (400)**
```json
{
  "status": false,
  "errors": [
    {
      "field": "lipa_number",
      "message": "Expected number, received string"
    }
  ]
}
```

**Fail - Conflict (409)**
```json
{
  "status": false,
  "error": "Oops 🙊,Lipa number already exist!"
}
```

---

## 5) Get Lipa Number Details

**Endpoint**  
`GET https://mai-link-production.up.railway.app/v1/api/lipa/{lnumber}`

**Path params**
- `lnumber` (number): lipa number

**Success (200)**
```json
{
  "status": true,
  "data": {
    "id": "uuid",
    "businessName": "Store A",
    "businessNumber": 123456,
    "network": "tigopesa"
  }
}
```

**Fail - Not found/lookup failure (409)**
```json
{
  "status": false,
  "error": "Oops 🙊,Lipa number doesn't exist!"
}
```

---

## 6) Open Public Payment Page by Link Code

**Endpoint**  
`GET https://mai-link-production.up.railway.app/{code}`

**Path params**
- `code` (string): payment code generated from `/v1/api/link/generate`

**Behavior**
- Opens a payment page for end users.
- User enters phone number and taps Pay.
- Payment page sends `POST /pay/{code}` internally.

**Backward compatibility**
- `GET https://mai-link-production.up.railway.app/pay/{code}` is also supported.

---

## 7) Initiate Payment by Code (Phone from User)

**Endpoint**  
`POST https://mai-link-production.up.railway.app/pay/{code}`

**Path params**
- `code` (string): payment code generated from `/v1/api/link/generate`

**Body**
```json
{
  "phone_number": "255758376759"
}
```

**Success (200)**
```json
{
  "success": true,
  "data": {
    "success": true,
    "data": {
      "id": "provider_payment_id",
      "status": "PENDING"
    }
  }
}
```

Note: returned `data` wraps provider response payload.

**Fail - Missing phone (400)**
```json
{
  "success": false,
  "error": "⚠️ Phone number is required."
}
```

**Fail - Invalid phone (400)**
```json
{
  "success": false,
  "error": "⚠️ Please enter a valid phone number."
}
```

**Fail - Invalid link (400)**
```json
{
  "success": false,
  "error": "⚠️ Oops! Invalid payment link."
}
```

**Fail - Already paid (400)**
```json
{
  "success": false,
  "error": "💰 This payment has already been completed! If you have any concerns, please contact the business. 🙏"
}
```

**Backward compatibility**
- `POST https://mai-link-production.up.railway.app/{code}` is also supported.

---

## Integration Notes for Frontend Flow

- Save `token` from signup/signin and send it in `Authorization` header for `/v1/api/link/generate`.
- Always send a unique `Idempotency-Key` when generating a payment link. Reusing the same key returns duplicate-request error.
- Use returned full URL in `data.code` to direct payer to payment flow (`/{code}`).
- Some endpoints use `success`, others use `status`; treat either as a boolean flag depending on endpoint.
- Payer submits phone number to `/pay/{code}`; check `success` field and `error` message on failures.