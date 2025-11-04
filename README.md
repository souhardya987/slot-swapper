# SlotSwapper

SlotSwapper is a full-stack, peer-to-peer time-slot scheduling application built as a technical challenge for the ServiceHive Full Stack Intern position.

## Overview & Design Choices

### Project Overview
The core concept of SlotSwapper is to allow users with busy calendars to trade time slots with one another. [cite_start]A user can mark one of their own busy events (e.g., "Team Meeting") as "swappable" [cite: 8-9]. Other users can then browse a "marketplace" of all available swappable slots and request to swap one of their own swappable slots for it.

When a user receives a swap request, they can "Accept" or "Reject" it. If the swap is accepted, the application atomically exchanges the ownership of the two events, updating the calendars for both users.

### Design Choices
* **Frontend:** **React (with Vite) + Tailwind CSS**.
    * **React** was chosen as it is a modern, powerful framework for building dynamic user interfaces and handling complex frontend state management.
    * **Vite** provides an extremely fast development server and optimized build process.
    * **Tailwind CSS** allows for rapid UI development with utility-first classes, keeping the focus on logic rather than writing custom CSS files.

* **Backend:** **Node.js + Express.js**.
    * An **Express** server is lightweight and was chosen from the allowed backend options to build the RESTful API. Its middleware-based architecture is ideal for handling authentication and request validation.

* **Database:** **MongoDB (with Mongoose)**.
    * A NoSQL database like MongoDB is a natural fit for the required schema. The data is easily modeled into collections for `Users`, `Events`, and `SwapRequests`.
    * **Mongoose** provides a straightforward, schema-based solution for data modeling, validation, and business logic.

* **Authentication:** **JWT (JSON Web Tokens)**.
    * As required, JWTs are used to manage authenticated sessions. The token is generated upon login and sent as a Bearer token with all protected API requests.

---

## How to Run Locally

Here are the clear, step-by-step instructions to set up and run the entire project on your local machine.

You will need **two separate terminals** running at the same time: one for the backend and one for the frontend.

### Prerequisites
* Node.js (v18 or later)
* `npm` or a compatible package manager
* A **MongoDB Connection String**. You can get a free one from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 1. Backend Setup (Terminal 1)

```bash
# 1. Clone the repository and navigate to the backend folder
$git clone [https://github.com/your-username/SlotSwapper.git$](https://github.com/your-username/SlotSwapper.git$) cd SlotSwapper/backend

# 2. Install all required dependencies
$ npm install

# 3. Create a .env file in the /backend folder
$ touch .env

# 4. Add your environment variables to the .env file.
# (The JWT_SECRET can be any long, random string)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_for_jwt

# 5. Start the backend development server
$ npm run dev
```
### 2. Frontend Setup (Terminal 2)

```bash
# 1. Open a new terminal and navigate to the frontend folder
$ cd SlotSwapper/frontend

# 2. Install all required dependencies
$ npm install

# 3. Start the frontend development server
$ npm run dev
```
### API Endpoints
## Authentication


#### POST	/api/auth/register	Signs up a new user (Name, Email, Password).
#### POST	/api/auth/login	Logs in an existing user and returns a JWT.

## Event Management

#### POST	/api/events	Creates a new event for the logged-in user.
#### GET	/api/events	Gets all events owned by the logged-in user.
#### PUT	/api/events/:id	

#### DELETE	/api/events/:id	Deletes an event.
#### GET	/api/events/swappable	Gets only the logged-in user's SWAPPABLE slots (for the swap modal).

## Core swap logic

#### GET	/api/swappable-slots	Gets all SWAPPABLE slots from other users.

#### POST	/api/swap-request	Creates a new swap request. Requires mySlotId and theirSlotId in the body. Sets both slots to SWAP_PENDING.

#### GET	/api/swap/requests Gets two lists for the "Requests" page: incoming and outgoing .

#### POST	/api/swap-response/:requestId	Responds to an incoming swap request. Body contains {"accept": true} or {"accept": false} .

## Assumptions

- **Event Simplicity:**  
  Events are treated as static, one-time occurrences. The system does **not** support recurring events.

- **1-to-1 Swaps:**  
  Each swap involves exactly two events — one from each user. No multi-slot or group swaps are considered.

- **Duration Conflict Ignored:**  
  The duration of events does not affect swaps. For example, a **30-minute slot** can be swapped for a **60-minute slot**.  
  The system focuses only on swapping event ownership records, not validating time duration compatibility.

---

## Challenges Faced

### Main Challenge: Atomic Swap Operation (`POST /api/swap-response`)
The most significant challenge was implementing the **server-side logic** to handle the acceptance of a swap request in a **transaction-safe** manner.

This operation required **multiple dependent database actions** that must either **all succeed or all fail** together to maintain data consistency.

#### The key operations included:
1. Updating the `SwapRequest` status to **ACCEPTED**.  
2. Exchanging the **owner (userId)** between the two `Event` documents.  
3. Updating both `Event` records to reflect their new ownership.  
4. Setting both `Event` statuses back to **BUSY**.  

To ensure **atomicity**, all these operations were executed within a **MongoDB transaction** using **Mongoose sessions**, preventing partial updates or data corruption in case of errors.
