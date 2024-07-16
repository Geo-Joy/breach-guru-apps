import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { appDescriptions } from "../utils/appDescriptions";

export async function getStaticProps() {
  const fs = require("fs");
  const path = require("path");
  const appsDirectory = path.join(process.cwd(), "apps");
  const filenames = fs.readdirSync(appsDirectory);
  const apps = filenames.map((filename) => {
    const appName = filename.replace(/\.[^/.]+$/, "");
    return {
      name: appName,
      url: appName
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase(),
      description:
        appDescriptions[
          appName
            .split(/(?=[A-Z])/)
            .join("-")
            .toLowerCase()
        ] || "No description available.",
    };
  });

  return {
    props: {
      apps,
    },
  };
}

const Home = ({ apps }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Breach Guru - Interactive Tutorials</title>
        <meta
          name="description"
          content="Explore interactive coding tutorials on various algorithms and data structures."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-primary p-6 text-white">
        <motion.h1
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Lab Breach Guru
        </motion.h1>
        <motion.p
          className="text-xl text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Interactive Coding Tutorials
        </motion.p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {apps.map((app, index) => (
            <motion.div
              key={app.name}
              className="bg-white border border-primary rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-primary">
                  {app.name.replace(/([A-Z])/g, " $1").trim()}
                </h2>
                <p className="text-gray-600 mb-4">{app.description}</p>
                <Link href={`/apps/${app.url}`} legacyBehavior>
                  <a className="inline-block bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition duration-300">
                    Explore
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="bg-primary text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Lab Breach Guru. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
