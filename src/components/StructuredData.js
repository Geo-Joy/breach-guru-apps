import Head from "next/head";

const StructuredData = ({ title, description, datePublished, author }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished: datePublished,
    publisher: {
      "@type": "Organization",
      name: "Lab - Breach Guru",
      logo: {
        "@type": "ImageObject",
        url: "https://lab.breach.guru/logo.png",
      },
    },
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
};

export default StructuredData;
