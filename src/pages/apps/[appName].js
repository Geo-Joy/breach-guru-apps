import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import StructuredData from "../../components/StructuredData";
import { appDescriptions } from "../../utils/appDescriptions";

const AppPage = ({ appName, description }) => {
  const router = useRouter();

  const pascalCaseName = appName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const DynamicComponent = dynamic(
    () => import(`../../../apps/${pascalCaseName}`),
    {
      loading: () => <p className="text-primary">Loading...</p>,
    }
  );

  const formatAppName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const title = `${formatAppName(appName)} Tutorial | Lab Breach Guru`;
  const keywords = `${formatAppName(
    appName
  )}, tutorial, interactive learning, coding, programming`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title={title} description={description} keywords={keywords} />
      <StructuredData
        title={title}
        description={description}
        datePublished={new Date().toISOString()}
        author="Your Name"
      />
      <header className="bg-primary p-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {formatAppName(appName)} Tutorial
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" legacyBehavior>
              <a className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                Back to Home
              </a>
            </Link>
          </motion.div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          className="bg-white border border-primary rounded-xl p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {appName && <DynamicComponent />}
        </motion.div>
      </main>
      <footer className="bg-primary text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Breach Guru. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export async function getStaticPaths() {
  const fs = require("fs");
  const path = require("path");
  const appsDirectory = path.join(process.cwd(), "apps");
  const filenames = fs.readdirSync(appsDirectory);
  const appNames = filenames.map((filename) =>
    filename
      .replace(/\.[^/.]+$/, "")
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase()
  );

  const paths = appNames.map((appName) => ({
    params: { appName },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const description =
    appDescriptions[params.appName] ||
    `Learn about ${params.appName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")} with this interactive tutorial on Lab Breach Guru.`;

  return {
    props: {
      appName: params.appName,
      description,
    },
  };
}

export default AppPage;
