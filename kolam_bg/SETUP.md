# Setup Guide for Majestic Kolam Animation

This guide will walk you through the simple steps required to set up and run the Majestic Kolam Animation on your local machine.

## Prerequisites

-   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
-   A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/)).

This project is built with static HTML and JavaScript (using React via a CDN) and does not require any complex build tools like Node.js or npm.

## 1. Download the Project Files

First, ensure you have the following files downloaded into a single folder on your computer. Let's call the folder `majestic-kolam`.

```
majestic-kolam/
├── index.html
└── index.tsx
```

You should only have these two files for the application to run.

## 2. Running the Application

You have two simple options to view the animation.

### Option A: Open the HTML File Directly (Easiest)

1.  Navigate to your `majestic-kolam` folder.
2.  Right-click on the `index.html` file.
3.  Choose "Open with" and select your preferred web browser.

The animation should now be running in your browser tab.

### Option B: Using a Local Server (Recommended for Development)

Running the project on a local server is a better practice as it mimics a real web environment. A very easy way to do this is with the **Live Server** extension in Visual Studio Code.

1.  **Install VS Code**: If you don't have it, [download and install it](https://code.visualstudio.com/).
2.  **Install Live Server Extension**:
    *   Open VS Code.
    *   Go to the Extensions view by clicking the icon in the sidebar or pressing `Ctrl+Shift+X`.
    *   Search for "Live Server" by Ritwick Dey.
    *   Click "Install".
3.  **Open the Project Folder**:
    *   In VS Code, go to `File > Open Folder...` and select your `majestic-kolam` folder.
4.  **Start the Server**:
    *   Right-click on the `index.html` file in the VS Code explorer.
    *   Select "Open with Live Server".
    *   This will automatically open a new browser tab with the animation running. The server also automatically reloads the page whenever you save a file, which is great for making changes.

## Customization

All the animation logic, parameters, and styling are contained within the `index.tsx` file. You can easily modify values inside this file to experiment:

-   Change the number of particles in `animationParams`.
-   Adjust the color palette in `goldenPalette`.
-   Experiment with the particle movement logic in the `animate` function.
