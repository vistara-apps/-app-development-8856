// Pinata IPFS integration for FASTA file storage

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

if (!PINATA_API_KEY || !PINATA_SECRET_KEY || !PINATA_JWT) {
  console.error('Pinata credentials are missing. Make sure to set VITE_PINATA_API_KEY, VITE_PINATA_SECRET_KEY, and VITE_PINATA_JWT in your environment variables.');
}

/**
 * Upload a file to Pinata IPFS
 * @param {File} file - The file to upload
 * @param {string} name - Name to identify the file
 * @param {Object} metadata - Additional metadata for the file
 * @returns {Promise<Object>} - Upload result with IPFS hash
 */
export const uploadFileToPinata = async (file, name, metadata = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const pinataMetadata = JSON.stringify({
      name: `traitsniffer_${name}`,
      keyvalues: {
        app: 'TraitSniffer',
        timestamp: Date.now(),
        fileType: file.type,
        fileSize: file.size,
        ...metadata
      }
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', pinataOptions);
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to upload to Pinata: ${error.message || response.statusText}`);
    }
    
    const result = await response.json();
    return {
      success: true,
      ipfsHash: result.IpfsHash,
      pinSize: result.PinSize,
      timestamp: result.Timestamp
    };
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get file metadata from Pinata
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {Promise<Object>} - File metadata
 */
export const getPinataMetadata = async (ipfsHash) => {
  try {
    const response = await fetch(`https://api.pinata.cloud/pinning/hashMetadata?ipfsPinHash=${ipfsHash}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get metadata from Pinata: ${error.message || response.statusText}`);
    }
    
    const result = await response.json();
    return {
      success: true,
      metadata: result
    };
  } catch (error) {
    console.error('Error getting metadata from Pinata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Unpin a file from Pinata
 * @param {string} ipfsHash - The IPFS hash of the file to unpin
 * @returns {Promise<Object>} - Unpin result
 */
export const unpinFromPinata = async (ipfsHash) => {
  try {
    const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to unpin from Pinata: ${error.message || response.statusText}`);
    }
    
    return {
      success: true,
      message: `Successfully unpinned ${ipfsHash}`
    };
  } catch (error) {
    console.error('Error unpinning from Pinata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get the IPFS gateway URL for a file
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {string} - The gateway URL
 */
export const getIpfsGatewayUrl = (ipfsHash) => {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
};

/**
 * Fetch a file from IPFS
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {Promise<Object>} - The file content
 */
export const fetchFromIpfs = async (ipfsHash) => {
  try {
    const gatewayUrl = getIpfsGatewayUrl(ipfsHash);
    const response = await fetch(gatewayUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    const content = await response.text();
    return {
      success: true,
      content
    };
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  uploadFileToPinata,
  getPinataMetadata,
  unpinFromPinata,
  getIpfsGatewayUrl,
  fetchFromIpfs
};
