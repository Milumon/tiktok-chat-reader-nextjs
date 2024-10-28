# TikTok-Chat-Reader (Next.js Version)

A Next.js-based chat reader for [TikTok LIVE](https://www.tiktok.com/live), utilizing [TikTok-Live-Connector](https://github.com/zerodytrash/TikTok-Live-Connector) and [Socket.IO](https://socket.io/) to forward data to the client. This project is a migration of the original [TikTok-Chat-Reader](https://github.com/zerodytrash/TikTok-Chat-Reader) to Next.js, leveraging the unofficial TikTok API to retrieve chat comments, gifts, and other events from TikTok LIVE and display them in a modern, responsive UI.

## Features
- Real-time chat messages and gift tracking from TikTok LIVE
- Responsive UI with Next.js and Tailwind CSS
- Automatic reconnection and error handling for a seamless chat experience

## Demo


## Installation

To run the chat reader locally, follow these steps:

1. **Install [Node.js](https://nodejs.org/)** on your system if you haven't already.
2. **Clone this repository** 
3. Open a terminal in the project root directory.
4. Install the dependencies by running:
```
npm install
```
5. Start the development server:
```
npm run dev
```


6. Visit `http://localhost:8081` in your browser to view the app.

### Running the Production Build

-----

To run the app in production mode, follow these steps:

1. Build the Next.js application:

```
npm run build
```


2. Start the server:

```
npm start
```


The app will now be available at `http://localhost:8081`.

## Environment Variables

This project requires environment variables for configuration. Create a `.env` file in the root of the project and add any necessary variables. For example:

PORT=8081
