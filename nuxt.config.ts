export default {
  env: {},
  head: {
    title: "投票チャート",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js TypeScript project" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  loading: { color: "#3B8070" },
  css: [
    "~/assets/css/main.css",
    /* Import Font Awesome Icons Set */
    '~/node_modules/flag-icon-css/css/flag-icon.min.css',
    /* Import Font Awesome Icons Set */
    '~/node_modules/font-awesome/css/font-awesome.min.css',
    /* Import Simple Line Icons Set */
    '~/node_modules/simple-line-icons/css/simple-line-icons.css',
    /* Import Bootstrap Vue Styles */
    '~/node_modules/bootstrap-vue/dist/bootstrap-vue.css',
    /* Import Core SCSS */
    { src: '~/assets/scss/style.scss', lang: 'scss' }
  ],
  build: {},
  buildModules: ["@nuxt/typescript-build"],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "bootstrap-vue/nuxt",
    "@nuxtjs/dotenv"
  ],
  axios: {},
  plugins: [
    '~/plugins/firebase',
  ],
}
