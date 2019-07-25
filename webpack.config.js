module.exports = {
    devServer: {
      contentBase: __dirname + '/public_html',
          inline: true,
        host: "0.0.0.0",
        port: 3000,
        stats: "minimal",
    },
}
