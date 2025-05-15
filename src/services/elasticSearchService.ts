
import { DocumentMetadata, SearchResult } from "../types/document";

// Connect to the real Elasticsearch instance
const elasticSearchUrl = "http://192.168.102.99:9200";
const clusterName = "linkedin";
const indexName = "word_documents";

// Common headers for all requests to handle CORS
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Cluster-Name': clusterName,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Cluster-Name'
});

export const elasticSearchService = {
  uploadDocument: async (file: File, metadata: Partial<DocumentMetadata>): Promise<boolean> => {
    try {
      console.log("Uploading document to Elasticsearch:", file.name, metadata);
      
      // Read the file content
      const fileContent = await file.arrayBuffer();
      const base64Content = btoa(
        new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      // Use file name without extension as document ID (similar to Python example)
      const docId = file.name.split('.')[0];
      
      // Prepare the document data, following similar structure to the Python example
      const documentData = {
        body: base64Content, // Base64 encoded file content
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        metadata: {
          creator: metadata.creator || "غير معروف",
          created: metadata.creationTime || new Date().toISOString(),
          modified: metadata.lastModified || new Date().toISOString(),
          uploadedAt: new Date().toISOString(),
          cluster_name: clusterName
        }
      };
      
      // Send the document to Elasticsearch with CORS headers
      const response = await fetch(`${elasticSearchUrl}/${indexName}/_doc/${docId}`, {
        method: 'PUT', // Using PUT with specific ID like in Python example
        headers: getHeaders(),
        body: JSON.stringify(documentData),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload document: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Document uploaded successfully:", result);
      
      return true;
    } catch (error) {
      console.error("Error uploading document to Elasticsearch:", error);
      throw error;
    }
  },
  
  searchDocuments: async (query: string): Promise<SearchResult[]> => {
    try {
      if (!query.trim()) return [];
      
      console.log("Searching Elasticsearch for:", query);
      
      // Prepare the search query - modified to match the example format
      const searchQuery = {
        query: {
          match: {
            body: query
          }
        },
        highlight: {
          fields: {
            body: {}
          }
        }
      };
      
      // Send the search request to Elasticsearch with CORS headers
      const response = await fetch(`${elasticSearchUrl}/${indexName}/_search`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(searchQuery),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Search results:", result);
      
      // Transform the Elasticsearch response to our application format
      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        content: hit._source.body,
        metadata: {
          creator: hit._source.metadata?.creator || "غير معروف",
          creationTime: hit._source.metadata?.created || hit._source.metadata?.uploadedAt,
          lastModified: hit._source.metadata?.modified || hit._source.metadata?.uploadedAt,
          fileName: hit._source.filename || "بلا اسم"
        },
        highlights: hit.highlight?.body || []
      }));
    } catch (error) {
      console.error("Error searching documents in Elasticsearch:", error);
      throw error;
    }
  }
};
