import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/Redux/jobSlice";
import { Search } from "lucide-react";

const categories = [
  {
    title: "Software Engineer",
    icon: "💻",
    gradient: "from-blue-100 to-blue-200",
    textColor: "text-blue-700",
    stats: { openings: "2.5K+", avgSalary: "$120K" },
  },
  {
    title: "Data Scientist",
    icon: "📊",
    gradient: "from-blue-100 to-blue-200",
    textColor: "text-blue-700",
    stats: { openings: "1.8K+", avgSalary: "$135K" },
  },
  {
    title: "AI Engineer",
    icon: "🤖",
    gradient: "from-blue-100 to-blue-200",
    textColor: "text-blue-700",
    stats: { openings: "1.2K+", avgSalary: "$150K" },
  },
  {
    title: "Full Stack Developer",
    icon: "🌐",
    gradient: "from-blue-100 to-blue-200",
    textColor: "text-blue-700",
    stats: { openings: "3K+", avgSalary: "$125K" },
  },
  {
    title: "DevOps Engineer",
    icon: "⚙️",
    gradient: "from-blue-100 to-blue-200",
    textColor: "text-blue-700",
    stats: { openings: "1.5K+", avgSalary: "$140K" },
  },
  {
    title: "UI/UX Designer",
    icon: "🎨",
    gradient: "from-blue-100 to-blue-200",
    textColor: "text-blue-700",
    stats: { openings: "900+", avgSalary: "$110K" },
  },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [query, setQuery] = useState("");

  const searchJobHandler = (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) return;
    const trimmedQuery = searchQuery.trim();
    dispatch(setSearchedQuery(trimmedQuery));
    navigate(`/browse?search=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchJobHandler(query);
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900">Explore Top Roles</h2>
          <p className="text-gray-600 mt-3">
            Browse categories and find the role that matches your skills
          </p>
        </div>

        {user && (
          <form
            onSubmit={handleSubmit}
            className="mb-12 max-w-3xl mx-auto w-full"
          >
            <div className="flex items-center border border-blue-200 rounded-full overflow-hidden shadow-sm hover:shadow-md transition">
              <input
                type="text"
                placeholder="Search job title, company, or location..."
                className="w-full px-5 py-3 text-gray-800 focus:outline-none text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="rounded-none rounded-r-full bg-blue-600 hover:bg-blue-700 text-white px-5"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>
        )}

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-4 md:-ml-6">
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3"
              >
                <div
                  onClick={() => searchJobHandler(cat.title)}
                  className="cursor-pointer bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all p-5 h-full flex flex-col justify-between hover:scale-[1.015]"
                >
                  <div>
                    <div className="text-5xl mb-3">{cat.icon}</div>
                    <h3
                      className={`${cat.textColor} text-lg font-semibold mb-1`}
                    >
                      {cat.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Explore opportunities for {cat.title.toLowerCase()}s
                    </p>
                  </div>
                  <div className="flex justify-between text-sm mb-4 text-blue-700 font-medium">
                    <div>
                      <p className="text-xs text-gray-500">Openings</p>
                      <p>{cat.stats.openings}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Avg. Salary</p>
                      <p>{cat.stats.avgSalary}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    View Jobs
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6 hover:bg-blue-100 text-blue-600" />
          <CarouselNext className="-right-6 hover:bg-blue-100 text-blue-600" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
