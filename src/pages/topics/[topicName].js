import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { FaLinkedin, FaYoutube } from "react-icons/fa";

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), "topics"));
  const paths = files.map((filename) => ({
    params: {
      topicName: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { topicName } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), "topics", topicName + ".md"),
    "utf-8"
  );
  const { data: frontmatter, content } = matter(markdownWithMeta);

  const htmlContent = marked(content);

  return {
    props: {
      frontmatter,
      content: htmlContent,
      topicName,
    },
  };
}

const TopicPage = ({ frontmatter, content, topicName }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>{frontmatter.title} | Lab Breach Guru</title>
        <meta name="description" content={frontmatter.description} />
      </Head>

      <header className="bg-primary p-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
          <Link
            href="/"
            className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="prose lg:prose-xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </article>

        {frontmatter.relatedApps && frontmatter.relatedApps.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Related Apps:</h2>
            <ul className="list-disc list-inside">
              {frontmatter.relatedApps.map((app) => (
                <li key={app}>
                  <Link
                    href={`/apps/${app
                      .toLowerCase()
                      .split(/(?=[A-Z])/)
                      .join("-")}`}
                    className="text-primary hover:underline"
                  >
                    {app}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Tags:</h2>
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
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

export default TopicPage;
