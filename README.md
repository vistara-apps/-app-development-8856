# TraitSniffer

TraitSniffer is an application for genetic marker detection and trait prediction using FASTA files.

## Features

- Supabase Integration for authentication and data persistence
- Pinata IPFS Integration for FASTA file storage
- Enhanced Trait Analysis for genetic marker detection
- Comprehensive API services for user, upload, and analysis operations
- Robust error handling and validation

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your credentials:
   ```
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Pinata IPFS Configuration
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_KEY=your_pinata_secret_key
   VITE_PINATA_JWT=your_pinata_jwt
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Build

To build the application for production:

```
npm run build
```

## Deployment

The application is configured for deployment on Vercel. The GitHub Actions workflow will automatically deploy the application to Vercel when changes are pushed to the main branch or when a pull request is created.

## Project Structure

- `/src/components`: React components
- `/src/contexts`: React contexts for state management
- `/src/lib`: Utility functions and libraries
- `/src/router`: Routing configuration
- `/src/services`: API services for backend communication

