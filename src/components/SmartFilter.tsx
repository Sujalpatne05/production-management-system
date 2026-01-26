import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Save, X, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FilterField {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: string[];
}

interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, string>;
  isFavorite?: boolean;
}

interface SmartFilterProps {
  fields: FilterField[];
  onApplyFilters: (filters: Record<string, string>) => void;
  storageKey?: string;
}

const SmartFilter = ({ fields, onApplyFilters, storageKey = "smart-filters" }: SmartFilterProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [filterName, setFilterName] = useState("");

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
    toast({
      title: "Filters applied",
      duration: 2000,
    });
  };

  const handleClear = () => {
    setFilters({});
    onApplyFilters({});
    toast({
      title: "Filters cleared",
      duration: 2000,
    });
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast({
        title: "Please enter a filter name",
        variant: "destructive",
      });
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...filters },
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setFilterName("");
    toast({
      title: "Filter saved successfully",
      description: `"${filterName}" has been saved`,
    });
  };

  const handleLoadFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
    onApplyFilters(savedFilter.filters);
    setIsOpen(false);
    toast({
      title: "Filter loaded",
      description: `Applied "${savedFilter.name}"`,
    });
  };

  const handleDeleteFilter = (id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast({
      title: "Filter deleted",
    });
  };

  const handleToggleFavorite = (id: string) => {
    const updated = savedFilters.map((f) =>
      f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
    );
    setSavedFilters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const activeFilterCount = Object.keys(filters).filter((k) => filters[k]).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Smart Filters</h4>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Fields */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-sm">{field.label}</Label>
                {field.type === "select" && field.options ? (
                  <Select
                    value={filters[field.name] || ""}
                    onValueChange={(value) => handleFilterChange(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={`Filter by ${field.label.toLowerCase()}`}
                    value={filters[field.name] || ""}
                    onChange={(e) => handleFilterChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Save Filter */}
          <div className="space-y-2 pt-3 border-t">
            <Label className="text-sm">Save this filter</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Filter name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
              <Button size="sm" onClick={handleSaveFilter}>
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="space-y-2 pt-3 border-t">
              <Label className="text-sm">Saved Filters</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {savedFilters.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <button
                      className="flex-1 text-left text-sm"
                      onClick={() => handleLoadFilter(saved)}
                    >
                      {saved.name}
                    </button>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleToggleFavorite(saved.id)}
                      >
                        <Star
                          className={`w-3 h-3 ${
                            saved.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDeleteFilter(saved.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SmartFilter;
