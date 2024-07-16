import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import fs from "fs";
import path from "path";

const AppPage = () => {
  const router = useRouter();
  const { appName } = router.query;

  const pascalCaseName = appName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const DynamicComponent = dynamic(
    () => import(`../../../apps/${pascalCaseName}`),
    {
      loading: () => <p>Loading...</p>,
    }
  );

  const formatAppName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="p-4">
      <Head>
        <title>{formatAppName(appName)} - My App Collection</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">{formatAppName(appName)}</h1>
      {appName && <DynamicComponent />}
    </div>
  );
};

export async function getStaticPaths() {
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
  return {
    props: { appName: params.appName },
  };
}

export default AppPage;
