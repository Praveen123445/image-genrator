"use client";
import { Post } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/image");
      const data = await response.json();
      
      // Check if the data is an array
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="w-full min-h-dvh p-3 pt-[72px] grid grid-cols-[repeat(auto-fill, minmax(250px,1fr))] gap-3">
      {loading ? (
        <div className="col-auto border flex justify-center items-center">
          <BiLoaderCircle className="animate-spin"/>
        </div>
      ) : posts.length > 0 
          ? posts.map((post) => (
              <motion.div className="w-full h-full border rounded-md p-2.5" key={post.id}>
                <Image
                  src={post.url}
                  width={250}
                  height={250}
                  alt={post.prompt}
                  className="object-cover w-full rounded-md"
                />
                <p className="text-white/80">{post.prompt}</p>
              </motion.div>
            ))
          : "No posts available."}
    </div>
  );
}
