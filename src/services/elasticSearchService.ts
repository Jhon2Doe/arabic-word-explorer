
import { DocumentMetadata, SearchResult } from "../types/document";

// This is a mock service that simulates interaction with Elasticsearch
// In a real application, this would make actual API calls to your Elasticsearch instance
export const elasticSearchService = {
  uploadDocument: async (file: File, metadata: Partial<DocumentMetadata>): Promise<boolean> => {
    // In a real implementation, this would:
    // 1. Convert the Word document to text (possibly using a backend service)
    // 2. Send the document content and metadata to Elasticsearch
    
    console.log("Simulating document upload to Elasticsearch:", file.name, metadata);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  },
  
  searchDocuments: async (query: string): Promise<SearchResult[]> => {
    // In a real implementation, this would:
    // 1. Send the search query to Elasticsearch
    // 2. Process and return the results
    
    console.log("Simulating Elasticsearch query:", query);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock results for demonstration
    if (!query.trim()) return [];
    
    // Create some mock Arabic content for demonstration
    const arabicLoremIpsum = "هذا نص عربي يحتوي على بعض الكلمات للبحث. يمكن استبدال هذا النص بمحتوى حقيقي من وثائق الوورد العربية المخزنة في إيلاستك سيرش.";
    
    return [
      {
        id: "doc1",
        content: arabicLoremIpsum + " " + query,
        metadata: {
          creator: "أحمد محمد",
          creationTime: "2023-04-15T10:30:00",
          lastModified: "2023-05-20T14:22:00",
          fileName: "تقرير_شهري.docx"
        },
        highlights: [`... يحتوي على بعض <mark>${query}</mark> للبحث ...`]
      },
      {
        id: "doc2",
        content: arabicLoremIpsum.replace("بعض", query),
        metadata: {
          creator: "سارة أحمد",
          creationTime: "2023-06-10T09:15:00",
          lastModified: "2023-06-10T09:15:00",
          fileName: "ملخص_اجتماع.docx"
        },
        highlights: [`... عربي يحتوي على <mark>${query}</mark> الكلمات ...`]
      }
    ];
  }
};
