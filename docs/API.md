# TraitSniffer API Documentation

This document provides comprehensive documentation for the TraitSniffer application API, including authentication, data models, and endpoints.

## Table of Contents

1. [Authentication](#authentication)
2. [Data Models](#data-models)
3. [API Services](#api-services)
4. [External Integrations](#external-integrations)
5. [Error Handling](#error-handling)

## Authentication

TraitSniffer uses Supabase for authentication and user management. The authentication flow is as follows:

### Sign Up

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
});
```

- Creates a new user account
- Sends a confirmation email to the user
- Creates a user profile in the `profiles` table

### Sign In

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword',
});
```

- Authenticates a user with email and password
- Returns a session object with an access token and refresh token

### Sign Out

```javascript
const { error } = await supabase.auth.signOut();
```

- Invalidates the current session
- Removes the user from the client state

### Password Reset

```javascript
const { data, error } = await supabase.auth.resetPasswordForEmail('user@example.com', {
  redirectTo: 'https://traitsniffer.com/reset-password',
});
```

- Sends a password reset email to the user
- Redirects the user to the specified URL after clicking the reset link

## Data Models

### User

The `profiles` table stores user profile information:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users.id |
| email | text | User's email address |
| created_at | timestamp | When the profile was created |
| updated_at | timestamp | When the profile was last updated |

### Upload

The `uploads` table stores information about uploaded FASTA files:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles.id |
| filename | text | Original filename |
| file_size | integer | Size in bytes |
| ipfs_hash | text | IPFS hash for storage |
| metadata | jsonb | Additional file metadata |
| created_at | timestamp | When the upload was created |

### Result

The `results` table stores analysis results:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| upload_id | uuid | References uploads.id |
| traits | jsonb | Predicted traits |
| markers | jsonb | Found genetic markers |
| sequence_length | integer | Length of the analyzed sequence |
| analysis_date | timestamp | When the analysis was performed |
| created_at | timestamp | When the result was created |

## API Services

### User API

#### Get User Profile

```javascript
const { data, error } = await UserAPI.getProfile(userId);
```

- Returns the user's profile information

#### Update User Profile

```javascript
const { data, error } = await UserAPI.updateProfile(userId, {
  display_name: 'New Name',
});
```

- Updates the user's profile information

### Upload API

#### Upload FASTA File

```javascript
const { data, error } = await UploadAPI.uploadFastaFile(userId, file, metadata);
```

- Uploads a FASTA file to Pinata IPFS
- Creates an upload record in the database

#### Get User Uploads

```javascript
const { data, error } = await UploadAPI.getUserUploads(userId);
```

- Returns all uploads for a user, including associated results

#### Get Upload by ID

```javascript
const { data, error } = await UploadAPI.getUploadById(uploadId);
```

- Returns a specific upload by ID, including associated results

#### Delete Upload

```javascript
const { data, error } = await UploadAPI.deleteUpload(uploadId, ipfsHash);
```

- Deletes an upload from the database
- Unpins the file from Pinata IPFS

### Analysis API

#### Save Analysis Results

```javascript
const { data, error } = await AnalysisAPI.saveResults(uploadId, results);
```

- Saves analysis results to the database

#### Get Result by ID

```javascript
const { data, error } = await AnalysisAPI.getResultById(resultId);
```

- Returns a specific result by ID, including associated upload

#### Get Results by Upload ID

```javascript
const { data, error } = await AnalysisAPI.getResultsByUploadId(uploadId);
```

- Returns all results for a specific upload

#### Delete Result

```javascript
const { data, error } = await AnalysisAPI.deleteResult(resultId);
```

- Deletes a result from the database

## External Integrations

### Pinata IPFS

TraitSniffer uses Pinata for FASTA file storage. The integration includes:

#### Upload File to Pinata

```javascript
const result = await pinataService.uploadFileToPinata(file, name, metadata);
```

- Uploads a file to Pinata IPFS
- Returns the IPFS hash and other metadata

#### Get Pinata Metadata

```javascript
const result = await pinataService.getPinataMetadata(ipfsHash);
```

- Returns metadata for a file stored on Pinata

#### Unpin from Pinata

```javascript
const result = await pinataService.unpinFromPinata(ipfsHash);
```

- Removes a file from Pinata IPFS

#### Fetch from IPFS

```javascript
const result = await pinataService.fetchFromIpfs(ipfsHash);
```

- Fetches a file from IPFS using the Pinata gateway

## Error Handling

All API functions return a standardized response object:

```javascript
{
  success: boolean,
  error: string | null,
  data: any | null
}
```

- `success`: Indicates whether the operation was successful
- `error`: Contains an error message if the operation failed
- `data`: Contains the response data if the operation was successful

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| 401 | Unauthorized - User is not authenticated |
| 403 | Forbidden - User does not have permission |
| 404 | Not Found - Resource does not exist |
| 422 | Validation Error - Invalid input data |
| 500 | Server Error - Something went wrong on the server |

### Error Handling Example

```javascript
const { success, error, data } = await UserAPI.getProfile(userId);

if (!success) {
  console.error('Error fetching profile:', error);
  // Handle error
} else {
  // Use data
  console.log('User profile:', data);
}
```
