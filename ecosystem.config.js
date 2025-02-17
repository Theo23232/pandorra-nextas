module.exports = {
    apps: [
        {
            name: "pandorra prod",
            script: "npm",
            args: "start",
            env: {
                PORT: 3002,
                NODE_ENV: "production"
            }
        }
    ]
}