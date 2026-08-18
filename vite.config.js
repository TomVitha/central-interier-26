export default {
  appType: 'spa',
  plugins: [
    {
      name: 'reload-on-block-change',
      hotUpdate({ file, server }) {
        if (file.includes('/blocks/') && file.endsWith('.html')) {
          server.ws.send({ type: 'full-reload' })
          return [] // prevent default HMR handling for this file
        }
      },
    },
  ],
}