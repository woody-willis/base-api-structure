module.exports = {
    apps: [
        {
            name: "m3u-streamer",
            script: "./dist/index.js",
            env: { NODE_ENV: "production" },
            restart_delay: 5000,
            min_uptime: 10000,
            cron_restart: "0 2 * * *",
        },
    ],
};
