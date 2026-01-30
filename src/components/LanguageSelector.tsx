import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, languages } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage, currentLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3 h-9 sm:h-10">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline text-sm">{currentLanguage.name}</span>
          <span className="sm:hidden text-xs">{currentLanguage.shortCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 sm:w-52 bg-popover z-50 p-1">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between cursor-pointer px-2 sm:px-3 py-2 text-xs sm:text-sm ${
              language === lang.code ? "bg-primary/10" : ""
            }`}
          >
            <span className="flex items-center gap-2 sm:gap-3">
              <span className="font-semibold text-muted-foreground uppercase w-6">
                {lang.shortCode}
              </span>
              <span className="hidden sm:inline">{lang.nativeName}</span>
              <span className="sm:hidden">{lang.name}</span>
            </span>
            {language === lang.code && (
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
