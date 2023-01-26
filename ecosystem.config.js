module.exports = {
  apps : [{
    name   : "Chin Two",
    script : "./svrsttdjhnf/apgtrhtap.js",
    log: './logs/combined.outerr.log',
        error_file: "./logs/error.log",
        watch: true,
        ignore_watch: ["logs/*", "public/*"],
        env: {
            "NODE_ENV": "local"
        },
        env_development: {
            "NODE_ENV": "demo"
        },
        env_production: {
            "NODE_ENV": "prod"
        }
  }]
}
