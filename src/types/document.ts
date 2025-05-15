
export interface DocumentMetadata {
  creator: string;
  creationTime: string;
  lastModified: string;
  fileName: string;
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  highlights?: string[];
}
