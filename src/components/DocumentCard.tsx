
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchResult } from "@/types/document";
import { formatDate } from "@/lib/utils";

interface DocumentCardProps {
  document: SearchResult;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-right">
          {document.metadata.fileName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-right text-muted-foreground">المنشئ:</div>
          <div className="text-right font-medium">{document.metadata.creator}</div>
          
          <div className="text-right text-muted-foreground">تاريخ الإنشاء:</div>
          <div className="text-right font-medium">
            {formatDate(document.metadata.creationTime)}
          </div>
          
          <div className="text-right text-muted-foreground">آخر تعديل:</div>
          <div className="text-right font-medium">
            {formatDate(document.metadata.lastModified)}
          </div>
        </div>
        
        {document.highlights && document.highlights.length > 0 && (
          <div className="space-y-2 border-t pt-2">
            <h4 className="text-sm font-medium text-right">نتائج البحث:</h4>
            <div className="rounded-md bg-muted p-3 text-right" dir="rtl">
              {document.highlights.map((highlight, index) => (
                <p 
                  key={index} 
                  className="text-sm" 
                  dangerouslySetInnerHTML={{ __html: highlight }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
