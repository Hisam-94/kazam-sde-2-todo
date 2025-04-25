import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

// Middleware to validate inputs using express-validator
export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check if there are validation errors
    const errors = validationResult(req);
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

export default validate;
