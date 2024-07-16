import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { appDescriptions } from "../../utils/appDescriptions";
import { FaLinkedin, FaYoutube } from "react-icons/fa";

export async function getStaticProps() {
  // Get apps
  const appsDirectory = path.join(process.cwd(), "apps");
  const appFilenames = fs.readdirSync(appsDirectory);
  const apps = appFilenames.map((filename) => {
    const appName = filename.replace(/\.js$/, "");
    const urlName = appName
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase();
    const displayName = appName.split(/(?=[A-Z])/).join(" ");
    return {
      name: displayName,
      url: `/apps/${urlName}`,
      type: "hands-on",
      description:
        appDescriptions[appName] || `Hands-on example for ${displayName}`,
    };
  });

  // Get topics
  const topicsDirectory = path.join(process.cwd(), "topics");
  const topicFilenames = fs.readdirSync(topicsDirectory);
  const topics = topicFilenames.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join(topicsDirectory, filename),
      "utf-8"
    );
    const { data } = matter(markdownWithMeta);
    return {
      ...data,
      url: `/topics/${filename.replace(".md", "")}`,
      type: "topic",
    };
  });

  // Combine apps and topics
  const items = [...apps, ...topics];

  return {
    props: {
      items,
    },
  };
}

const Home = ({ items }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredItems =
    selectedFilter === "all"
      ? items
      : items.filter((item) => item.type === selectedFilter);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Breach Guru's - Interactive Tutorials</title>
        <meta
          name="description"
          content="Explore interactive coding tutorials and learn about various algorithms and techniques."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-primary p-6 text-white">
        <h1 className="text-4xl font-bold text-center">Breach Guru's</h1>
        <p className="text-xl text-center mt-2">Interactive Tutorials</p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filter:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-primary"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("hands-on")}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === "hands-on"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-primary"
              }`}
            >
              Hands-on
            </button>
            <button
              onClick={() => setSelectedFilter("topic")}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === "topic"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-primary"
              }`}
            >
              Topic
            </button>
          </div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.name || item.title}
              className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                item.type === "hands-on"
                  ? "border-2 border-blue-500"
                  : "border-2 border-green-500"
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-primary">
                  {item.name || item.title}
                </h2>
                <p className="text-gray-600 mb-4 h-20 overflow-y-auto">
                  {item.description}
                </p>
                <Link
                  href={item.url}
                  className={`inline-block text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition duration-300 ${
                    item.type === "hands-on"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {item.type === "hands-on" ? "Try it out" : "Learn more"}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="bg-primary text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a
              href="http://go.breach.guru/428CUG"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-white text-2xl hover:text-gray-400" />
            </a>
            <a
              href="http://go.breach.guru/7OzymQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-white text-2xl hover:text-gray-400" />
            </a>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Geo Joy (Breach Guru). All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
