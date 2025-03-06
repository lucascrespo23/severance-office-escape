# Severance: Office Escape - Deployment Instructions

This document provides step-by-step instructions for deploying the Severance: Office Escape game on Vercel.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)
- A [Vercel](https://vercel.com/) account
- [Git](https://git-scm.com/)

## Project Structure

```
severance-office-escape/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   ├── logo192.png
│   └── logo512.png
├── src/
│   ├── components/
│   │   ├── LoadingScreen.js
│   │   ├── LoadingScreen.css
│   │   ├── OfficeEscapeGame.js
│   │   └── OfficeEscapeGame.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── reportWebVitals.js
├── package.json
└── .gitignore
```

## Local Setup

1. Create a new folder for your project:
   ```bash
   mkdir severance-office-escape
   cd severance-office-escape
   ```

2. Create the file structure as shown above and place all the code files in their respective locations.

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Test the application locally:
   ```bash
   npm start
   ```

5. Your app should now be running on [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

### Option 1: Deploy via GitHub

1. Create a GitHub repository and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/severance-office-escape.git
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com/) and sign up or log in.

3. Click "New Project".

4. Import your GitHub repository.

5. Vercel will automatically detect that this is a React application. The default settings should work fine.

6. Click "Deploy".

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. Follow the prompts. When asked if you want to link to an existing project, choose "No" to create a new one.

## Post-Deployment

Once deployed, Vercel will provide you with a URL for your application (e.g., `https://severance-office-escape.vercel.app`).

## Note on Assets

For a production application, you would want to create custom logos and favicon files:

- `public/favicon.ico` - The website icon (32x32 pixels)
- `public/logo192.png` - A 192x192 pixel version of your logo
- `public/logo512.png` - A 512x512 pixel version of your logo

For this deployment, you can create simple placeholder images or use the default React logos temporarily.

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Vercel build logs for any errors.
2. Ensure all dependencies are properly listed in package.json.
3. If there are issues with Three.js, try installing it with specific peer dependencies:
   ```bash
   npm install three@latest
   ```

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)
