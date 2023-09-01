"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    const status = res.statusCode;
    const body = res.json();
    return res.status(status).send({
        errors: [],
        response: body,
    });
}
exports.default = default_1;
