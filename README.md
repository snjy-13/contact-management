# Contact Management System

A full-stack Contact Management System built with **Node.js, Express.js, MongoDB, and Mongoose**, with a simple HTML/CSS/JavaScript frontend to add, view, edit, and delete contacts.

## Features

- Create, read, update, and delete contacts (full CRUD)
- Mongoose schema validation:
  - `name` — required string
  - `phone` — required, must be exactly 10 digits
  - `email` — required, unique, must be a valid email address
  - `contactId` — unique string, auto-generated (UUID) if not provided
- Proper error handling for validation failures, duplicate data, invalid IDs, and not-found resources
- Simple single-page frontend served by Express

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (database name: `contact_management`), Mongoose ODM
- **Frontend:** Plain HTML, CSS, JavaScript (served from `public/`)

## Project Structure

```
.
├── index.js            # Server entry point (Express app + MongoDB connection)
├── models/
│   └── contact.js      # Mongoose schema & model with validation
├── routes/
│   └── contacts.js     # CRUD routes for /contacts
├── public/             # Frontend (index.html, style.css, app.js)
├── .env                # Environment variables (not committed)
├── env-example         # Example environment file
└── package.json
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the environment**

   Create a `.env` file in the root directory (see `env-example`):

   ```
   MONGO_DB_URI=mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/contact_management
   # PORT=5000   (optional, defaults to 5000)
   ```

   The database name in the URI should be `contact_management`.

   > **Note for this workspace:** the pre-provisioned dev credentials in `.vscode/.studio/studio-env.json`
   > are only authorized for the `db_4553758h3` database, so `.env` here points to `db_4553758h3` to keep
   > the app runnable. On your own MongoDB/Atlas deployment, use a URI ending in `/contact_management`.

3. **Run the application**

   ```bash
   npm start        # production
   npm run dev      # development with auto-reload (nodemon)
   ```

4. Open **http://localhost:5000** in your browser to use the frontend.

## Contact Fields

| Field       | Type   | Rules                                              |
| ----------- | ------ | -------------------------------------------------- |
| `contactId` | String | Unique. Auto-generated UUID if not provided.       |
| `name`      | String | Required.                                          |
| `phone`     | String | Required. Must be exactly 10 digits.               |
| `email`     | String | Required. Unique. Must be a valid email address.   |

## API Endpoints

| Method   | Endpoint         | Description                | Success Status |
| -------- | ---------------- | -------------------------- | -------------- |
| `POST`   | `/contacts`      | Create a new contact       | `201`          |
| `GET`    | `/contacts`      | Get all contacts           | `200`          |
| `GET`    | `/contacts/:id`  | Get a contact by Mongo `_id` | `200`        |
| `PUT`    | `/contacts/:id`  | Update a contact by `_id`  | `200`          |
| `DELETE` | `/contacts/:id`  | Delete a contact by `_id`  | `200`          |

### Error Responses

| Status | Cause                                                        |
| ------ | ------------------------------------------------------------ |
| `400`  | Validation failure (missing/invalid fields) or malformed ID  |
| `404`  | Contact with the given ID does not exist                     |
| `409`  | Duplicate `email` (or `contactId`)                           |
| `500`  | Unexpected server error                                      |

## Examples

### Create a contact

```bash
curl -X POST http://localhost:5000/contacts \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phone": "9876543210", "email": "john@example.com"}'
```

Response (`201`):

```json
{
  "contactId": "3f6b2d90-....",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "_id": "66f9c1a2b4e5d6f7a8b9c0d1",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Get all contacts

```bash
curl http://localhost:5000/contacts
```

### Get one contact

```bash
curl http://localhost:5000/contacts/66f9c1a2b4e5d6f7a8b9c0d1
```

### Update a contact

```bash
curl -X PUT http://localhost:5000/contacts/66f9c1a2b4e5d6f7a8b9c0d1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "phone": "9123456780", "email": "johnsmith@example.com"}'
```

### Delete a contact

```bash
curl -X DELETE http://localhost:5000/contacts/66f9c1a2b4e5d6f7a8b9c0d1
```

### Example error — invalid phone (`400`)

```json
{
  "error": "Validation failed",
  "details": ["Phone number must be exactly 10 digits"]
}
```

### Example error — duplicate email (`409`)

```json
{
  "error": "A contact with this email already exists"
}
```

### Example error — contact not found (`404`)

```json
{
  "error": "Contact not found"
}
```

## Running with Docker

```bash
docker build -t contact-management .
docker run -p 5000:5000 --env-file .env contact-management
```
