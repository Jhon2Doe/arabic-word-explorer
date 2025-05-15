
import DocumentUploader from "@/components/DocumentUploader";

const Upload = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">رفع مستند جديد</h1>
      <div className="max-w-2xl mx-auto">
        <DocumentUploader />
      </div>
    </div>
  );
};

export default Upload;
