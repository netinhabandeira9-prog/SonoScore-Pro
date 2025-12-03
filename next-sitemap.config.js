/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.sonoscorepro.com.br', // ← se seu site abre sem www, troque para https://sonoscorepro.com.br
  generateRobotsTxt: true, // cria também o robots.txt automaticamente
  changefreq: 'daily',
  priority: 1.0,
  exclude: [
    '/app',           // esconde a área de membros do Google (só entra quem está logado)
    '/app/*',
    '/checkout',
    '/obrigado',
    '/api/*'
  ],
}
