
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { elasticSearchService } from "@/services/elasticSearchService";
import { DocumentMetadata } from "@/types/document";
import { useToast } from "@/components/ui/use-toast";

const DocumentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [creator, setCreator] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار ملف",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const metadata: Partial<DocumentMetadata> = {
        creator: creator || "مستخدم غير معروف",
        creationTime: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        fileName: file.name,
      };

      await elasticSearchService.uploadDocument(file, metadata);
      
      toast({
        title: "نجاح",
        description: "تم رفع المستند بنجاح",
      });
      
      // Reset form
      setFile(null);
      setCreator("");
      
      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في رفع المستند",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right">رفع مستند Word</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="creator" className="block text-sm font-medium text-right">
            المنشئ
          </label>
          <Input
            id="creator"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="اسم منشئ المستند"
            className="text-right"
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="file-upload" className="block text-sm font-medium text-right">
            ملف Word (docx)
          </label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".docx,.doc"
            className="text-right"
          />
          {file && (
            <p className="text-sm text-muted-foreground text-right">
              الملف المحدد: {file.name}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !file}
        >
          {isUploading ? "جاري الرفع..." : "رفع المستند"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUploader;
