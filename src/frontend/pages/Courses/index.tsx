"use client";

import CourseSummary from "@/components/CourseSummary";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCourses from "@/hooks/courses/useGetCourses";
import { Filter, Loader2, Search, SortAsc, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const Courses = () => {
  // main state
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [appliedFilter, setAppliedFilter] = useState({
    category: "all",
    level: "all",
    minPrice: "",
    maxPrice: "",
  });

  const [appliedSort, setAppliedSort] = useState("newest");

  // ui state
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // temp state for popovers
  const [tempFilter, setTempFilter] = useState(appliedFilter);
  const [tempSort, setTempSort] = useState(appliedSort);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // sync temp state on open
  useEffect(() => {
    if (filterOpen) {
      setTempFilter(appliedFilter);
    }
  }, [filterOpen, appliedFilter]);

  useEffect(() => {
    if (sortOpen) {
      setTempSort(appliedSort);
    }
  }, [sortOpen, appliedSort]);

  // fetch data
  const { data, isFetching: isLoading } = useGetCourses({
    queryKey: ["courses", debouncedSearchText, appliedFilter, appliedSort],
    queryParams: {
      keyword: debouncedSearchText,
      // clean params
      category:
        appliedFilter.category === "all" ? undefined : appliedFilter.category,
      level: appliedFilter.level === "all" ? undefined : appliedFilter.level,
      minPrice: appliedFilter.minPrice || undefined,
      maxPrice: appliedFilter.maxPrice || undefined,
      sort: appliedSort,
    },
  });

  const courses = data?.data;

  // apply filter
  const handleApplyFilter = () => {
    setAppliedFilter(tempFilter);
    setFilterOpen(false);
  };

  // apply sort
  const handleApplySort = () => {
    setAppliedSort(tempSort);
    setSortOpen(false);
  };

  // reset all
  const handleResetAll = () => {
    setSearchText("");
    setAppliedFilter({
      category: "all",
      level: "all",
      minPrice: "",
      maxPrice: "",
    });
    setAppliedSort("newest");
  };

  // check active filters
  const isFiltering =
    searchText !== "" ||
    appliedFilter.category !== "all" ||
    appliedFilter.level !== "all" ||
    appliedFilter.minPrice !== "" ||
    appliedFilter.maxPrice !== "" ||
    appliedSort !== "newest";

  // update temp filter helper
  const updateTempFilter = (key: string, value: string) => {
    setTempFilter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen w-full container mx-auto p-4 py-8 space-y-8">
      {/* header toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-end lg:items-center">
        {/* search box */}
        <div className="w-full lg:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {/* filter popover */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-2 border-gray-300 hover:bg-gray-100 ${
                  // highlight if active
                  appliedFilter.category !== "all" ||
                  appliedFilter.level !== "all" ||
                  appliedFilter.minPrice ||
                  appliedFilter.maxPrice
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : ""
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
                {(appliedFilter.category !== "all" ||
                  appliedFilter.level !== "all" ||
                  appliedFilter.minPrice ||
                  appliedFilter.maxPrice) && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 ml-1" />
                )}
              </Button>
            </PopoverTrigger>

            {/* popover content */}
            <PopoverContent className="w-[340px] p-0" align="end">
              <div className="p-4 border-b bg-gray-50/50">
                <Text className="font-semibold">Search Filters</Text>
              </div>

              <div className="p-4 space-y-5">
                {/* category */}
                <div className="space-y-2">
                  <Text size="sm" className="font-medium text-gray-700">
                    Category
                  </Text>
                  <Select
                    value={tempFilter.category}
                    onValueChange={(val) => updateTempFilter("category", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Fullstack">Fullstack</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* level */}
                <div className="space-y-2">
                  <Text size="sm" className="font-medium text-gray-700">
                    Level
                  </Text>
                  <Select
                    value={tempFilter.level}
                    onValueChange={(val) => updateTempFilter("level", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* price range */}
                <div className="space-y-2">
                  <Text size="sm" className="font-medium text-gray-700">
                    Price Range
                  </Text>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={tempFilter.minPrice}
                      onChange={(e) =>
                        updateTempFilter("minPrice", e.target.value)
                      }
                      className="text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={tempFilter.maxPrice}
                      onChange={(e) =>
                        updateTempFilter("maxPrice", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* footer */}
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApplyFilter}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* sort popover */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
              >
                <SortAsc className="w-4 h-4" />
                {appliedSort === "newest" ? "Newest" : "Sort"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="end">
              <div className="p-4 border-b bg-gray-50/50">
                <Text className="font-semibold">Sort by</Text>
              </div>
              <div className="p-4">
                <Select value={tempSort} onValueChange={setTempSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price_asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name_asc">Name: A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApplySort}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* clear filter button */}
          {isFiltering && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-1" /> Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* results info */}
      <div className="flex items-center justify-between border-b pb-4">
        <Text size="lg" className="font-medium">
          {isLoading
            ? "Loading data..."
            : `Found ${courses?.length || 0} courses`}
        </Text>
      </div>

      {/* course list */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <Text className="text-gray-500">Searching for courses...</Text>
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course: any) => (
              <CourseSummary key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
            <Text className="text-gray-500 font-medium mb-2">
              No courses found.
            </Text>
            <Button
              variant="link"
              onClick={handleResetAll}
              className="text-blue-600"
            >
              Clear filters and try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
