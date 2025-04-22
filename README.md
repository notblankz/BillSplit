# BillSplit

**BillSplit** is a web application that simplifies expense splitting by parsing scanned bills and calculating individual shares based on what each person consumed. Originally built as a final project for a second-year Web Technologies course, the project demonstrates end-to-end web development using modern tools and API integrations.

## Features

- Upload bill images and parse item-wise details using OCR (powered by Mistral’s vision model)
- Extracts:
  - Itemized expenses
  - Tax breakdown (CGST & SGST)
  - Grand total
- Assign bill items to people involved in the transaction
- Automatically calculate who owes what
- Generate a summary image with total dues
- Google OAuth login for user authentication

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS + shadcn/ui
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** Google OAuth
- **OCR & Parsing:** Mistral Vision API + Prompt Engineering

## Live Demo

You can view the deployed project here:

**[https://real-billsplit.vercel.app/](https://real-billsplit.vercel.app/)**

> **Note:** Some features in the live demo may not work as expected due to expired or inactive API keys and services (such as the Mistral API or MongoDB cluster). The project is no longer actively maintained.

## Running Locally

To run the project locally, you'll need to set up both the frontend and backend along with the required environment variables.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/billsplit.git
cd billsplit
```

### 2. Set Up Environment Variables

Create the following `.env` files:

`client/.env`
```bash
VITE_GOOGLE_CLIENT_ID=<key>
VITE_BACKEND_BASE_URL=http://localhost:5000
```
`server/.env`
```bash
MISTRAL_API_KEY=<key>
MONGODB_URI=<uri>
MONGODB_DB=BillSplit
PORT=5000
```
### 3. Start the Backend Server
```bash
cd server
npm install
npx nodemon index.js
```
### 4. Start the Frontend

```bash
cd client
npm install
npm run dev
```

Once both servers are running, the app should be accessible at `http://localhost:5173`.

## Disclaimer

This project is no longer under active development or maintenance. It was built for academic purposes and may rely on third-party services or API keys that are now inactive. You’re welcome to fork and adapt it for your own use.

## License

This project is licensed under the MIT License
