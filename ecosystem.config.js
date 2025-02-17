module.exports = {
    apps: [
        {
            name: "nextjs",
            script: "npm",
            args: "start",
            env: {
                PORT: 3002,
                NODE_ENV: "production"
            }
        }
    ]
}