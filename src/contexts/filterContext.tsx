import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import dayjs from "dayjs";
import useFetchPosts, { IPost } from "@/hooks/use-fetch-posts";

// Define schema
const formSchema = z.object({
  iftar_type: z.enum(["dine_in", "take_out", ""]),
  gender: z.enum(["men", "women", "mixed", ""]),
  hostDate: z.union([z.date(), z.null()]), // Allow null values
});


// Define the context type
interface FilterContextType {
  filters: z.infer<typeof formSchema>;
  setFilters: (filters: z.infer<typeof formSchema>) => void;
  filteredPosts: IPost[] | null;
}

// Create context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
export const FilterContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { posts } = useFetchPosts();
  const [filters, setFilters] = useState<z.infer<typeof formSchema>>({
    iftar_type: "",
    gender: "",
    hostDate: null,
  });
  const [filteredPosts, setFilteredPosts] = useState<IPost[] | null>(null);

  useEffect(() => {
    if (!posts) return;
  
    const formattedDate = filters.hostDate ? dayjs(filters.hostDate).format("MM-DD-YYYY") : null;
  
    const filtered = posts.filter((post) => {
      const postDate = dayjs(post.host_date).format("MM-DD-YYYY");
  
      const matchesDate = formattedDate ? postDate === formattedDate : true;
      const matchesGender = filters.gender ? post.gender === filters.gender : true;
      const matchesIftarType = filters.iftar_type ? post.iftar_type === filters.iftar_type : true;
  
      return matchesDate && matchesGender && matchesIftarType;
    });
  
    // If no filters are applied, show everything
    if (!filters.hostDate && !filters.gender && !filters.iftar_type) {
      setFilteredPosts(posts);
    } else {
      // If filters are applied but no match is found, return empty array
      setFilteredPosts(filtered);
    }
  }, [posts, filters]);
  

  return (
    <FilterContext.Provider value={{ filters, setFilters, filteredPosts }}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterContextProvider");
  }
  return context;
};
