export default function requestLogger(req, res, next) {
    res.on("finish", () => {
        console.log(`${req.ip}: ${req.method}: ${req.path}: ${res.statusCode}`);
    });
    next();
}
