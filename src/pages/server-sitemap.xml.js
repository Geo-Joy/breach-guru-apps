import { getServerSideSitemap } from "next-sitemap";
import fs from "fs";
import path from "path";

export const getServerSideProps = async (ctx) => {
  const appsDirectory = path.join(process.cwd(), "apps");
  const filenames = fs.readdirSync(appsDirectory);
  const appNames = filenames.map((filename) =>
    filename.replace(/\.[^/.]+$/, "")
  );

  const fields = appNames.map((app) => ({
    loc: `https://lab.breach.guru/apps/${app
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    lastmod: new Date().toISOString(),
  }));

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}
