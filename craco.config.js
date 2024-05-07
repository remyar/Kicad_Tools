module.exports = {
    webpack: {
        configure: {
            target: 'electron-renderer'
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
    }
}