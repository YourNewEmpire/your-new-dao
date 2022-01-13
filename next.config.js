/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'ipfs.io/ipfs/' , 'ipfs.io'],
  },

  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
}