import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { FaLinkedin, FaYoutube } from "react-icons/fa";

const AppPage = ({ appName }) => {
  const DynamicComponent = dynamic(
    () => {
      const formattedAppName = appName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
      return import(`../../../apps/${formattedAppName}`);
    },
    {
      loading: () => <p>Loading...</p>,
      ssr: false,
    }
  );

  const formattedAppName = appName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>{formattedAppName} | Lab Breach Guru</title>
      </Head>

      <header className="bg-primary p-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">{formattedAppName}</h1>
          <Link
            href="/"
            className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <DynamicComponent />
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

export async function getStaticPaths() {
  const appsDirectory = path.join(process.cwd(), "apps");
  const filenames = fs.readdirSync(appsDirectory);
  const paths = filenames.map((filename) => {
    const appName = filename
      .replace(/\.js$/, "")
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase();
    return {
      params: { appName },
    };
  });

  console.log("Generated paths:", paths); // For debugging

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: { appName: params.appName } };
}

export default AppPage;
