import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";

export async function getStaticProps() {
  const appsDirectory = path.join(process.cwd(), "apps");
  const filenames = fs.readdirSync(appsDirectory);
  const appNames = filenames.map((filename) => ({
    original: filename.replace(/\.[^/.]+$/, ""),
    seo: filename
      .replace(/\.[^/.]+$/, "")
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase(),
  }));

  return {
    props: {
      appNames,
    },
  };
}

const Home = ({ appNames }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My React App Collection</h1>
      <div className="mb-4">
        {appNames.map((app) => (
          <Link key={app.original} href={`/apps/${app.seo}`} passHref>
            <a className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">
              {app.original.replace(/([A-Z])/g, " $1").trim()}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
