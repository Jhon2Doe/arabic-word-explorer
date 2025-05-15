
import { NavLink } from "react-router-dom";
import { FileText, Search } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="flex justify-center gap-8 py-4 border-b mb-8">
      <NavLink 
        to="/upload"
        className={({ isActive }) => 
          `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isActive 
              ? "bg-primary text-primary-foreground font-medium" 
              : "hover:bg-accent"
          }`
        }
      >
        <FileText className="h-4 w-4" />
        <span>رفع المستندات</span>
      </NavLink>
      
      <NavLink 
        to="/search"
        className={({ isActive }) => 
          `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isActive 
              ? "bg-primary text-primary-foreground font-medium" 
              : "hover:bg-accent"
          }`
        }
      >
        <Search className="h-4 w-4" />
        <span>البحث في المستندات</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
