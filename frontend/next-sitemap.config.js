/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.uni-dictionary.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/signin", "/profile"], // Add any paths you want to exclude
};
