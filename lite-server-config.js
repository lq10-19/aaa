module.exports = {
    port: 8080,
    watch: false,
    open: false,
    server: {
        baseDir: "./dist",
        middleware: [
            require("compression")()
        ]
    }
};