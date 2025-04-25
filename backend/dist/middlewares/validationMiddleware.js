"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
// Middleware to validate inputs using express-validator
const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map((validation) => validation.run(req)));
        // Check if there are validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            next();
            return;
        }
        // Return validation errors
        res.status(400).json({
            success: false,
            errors: errors.array().map((err) => {
                // Handle different types of validation errors
                let fieldName = "unknown";
                if ("path" in err) {
                    fieldName = err.path;
                }
                return {
                    field: fieldName,
                    message: err.msg,
                };
            }),
        });
        return;
    };
};
exports.validate = validate;
exports.default = exports.validate;
