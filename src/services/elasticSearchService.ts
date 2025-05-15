
import { DocumentMetadata, SearchResult } from "../types/document";

// Connect to the real Elasticsearch instance
const elasticSearchUrl = "http://192.168.102.99:9200";

export const elasticSearchService = {
  uploadDocument: async (file: File, metadata: Partial<DocumentMetadata>): Promise<boolean> => {
    try {
      console.log("Uploading document to Elasticsearch:", file.name, metadata);
      
      // Read the file content
      const fileContent = await file.arrayBuffer();
      const base64Content = btoa(
        new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      // Prepare the document data
      const documentData = {
        content: base64Content, // Base64 encoded file content
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString()
        }
      };
      
      // Send the document to Elasticsearch
      const response = await fetch(`${elasticSearchUrl}/documents/_doc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData)
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
      
      // Prepare the search query
      const searchQuery = {
        query: {
          multi_match: {
            query: query,
            fields: ["content", "metadata.*"]
          },
          highlight: {
            fields: {
              content: {}
            }
          }
        }
      };
      
      // Send the search request to Elasticsearch
      const response = await fetch(`${elasticSearchUrl}/documents/_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchQuery)
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Search results:", result);
      
      // Transform the Elasticsearch response to our application format
      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        content: hit._source.content,
        metadata: {
          creator: hit._source.metadata?.creator || "غير معروف",
          creationTime: hit._source.metadata?.creationTime || hit._source.metadata?.uploadedAt,
          lastModified: hit._source.metadata?.lastModified || hit._source.metadata?.uploadedAt,
          fileName: hit._source.fileName || "بلا اسم"
        },
        highlights: hit.highlight?.content || []
      }));
    } catch (error) {
      console.error("Error searching documents in Elasticsearch:", error);
      throw error;
    }
  }
};
