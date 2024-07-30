# HTTP Status Code Dog Image App

## Project Description

This project is a React-based web application that allows users to search for dog images associated with HTTP status codes. Users can filter images based on specific status codes or patterns, view details of individual images, create lists of their favorite images, and manage these lists. The application includes user authentication with login and signup functionality.

## Features

- **Search Images**: Users can search for dog images by entering specific HTTP status codes or patterns (e.g., 2xx, 20x).
- **View Image Details**: Each image displays its status code, title, and a link to view more details.
- **Create and Manage Lists**: Users can create lists of their favorite images, edit list names, and delete lists.
- **User Authentication**: Users can sign up, log in, and log out. Authentication is handled with JWT tokens.
- **Responsive Design**: The application is designed to be responsive and user-friendly on various devices.

## Technologies Used

- **Frontend**: React, React Router, Axios, CSS
- **Backend**: Node.js, Express, MongoDB (for API endpoints and data storage)
- **Authentication**: JWT (JSON Web Tokens)


# Usage

## Search Page
Enter a specific HTTP status code (e.g., 200) or a pattern (e.g., 2xx) in the search bar.
Click the "Search" button to fetch and display relevant dog images.
Click on an image to view its details or open its URL in a new tab.
Save the list of images by clicking the "Save List" button.

## Lists Page
View all your saved lists.
Click on a list to view its details, edit the list name, or delete the list.
Manage images within a list, including deleting individual images.

## Authentication
- **Signup:** Navigate to the Signup page, enter your email and password, and click "Signup".
- **Login:** Navigate to the Login page, enter your credentials, and click "Login".
- **Logout:** Click the "Logout" button in the Navbar to log out.

## Component Overview
- **Navbar**
- **Description:**Navigation bar that provides links to different pages based on user authentication status.
- **File:** src/components/Navbar.js

## SearchPage
- **Description:** Page where users can search for dog images by HTTP status codes or patterns.
- **File:** src/components/SearchPage.js

## ListDetailPage
- **Description:** Page where users can view details of a specific list, edit the list name, and manage images within the list.
- **File:** src/components/ListDetailPage.js

## SignupPage
- **Description:** Page for user registration.
- **File:** src/components/SignupPage.js

## LoginPage
- **Description:** Page for user login.
- **File:** src/components/LoginPage.js

## API Endpoints
- **GET /api/lists:** Fetch all lists.
- **GET /api/lists/:** Fetch a specific list by ID.
- **POST /api/lists:** Create a new list.
- **PUT /api/lists/:** Update a specific list by ID.
- **DELETE /api/lists/:** Delete a specific list by ID.
- **POST /api/auth/signup:** User registration.
- **POST /api/auth/login:** User login.
- **GET /api/auth/logout:** User logout.