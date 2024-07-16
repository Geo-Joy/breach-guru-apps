module.exports = {
  siteUrl: "https://lab.breach.guru",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml"], // exclude server-side sitemap
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://lab.breach.guru/server-sitemap.xml", // custom sitemap
    ],
  },
};
