import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express'


// Validate there is not any error in the input
function validateInput(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  
  // If there are errors, return a 400 response with the error messages
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg); 
    return res.status(400).json({ data: { errors: errorMessages } });
  }
  // //If there are errors, return a 400 response with an arry of errors
  // if (!errors.isEmpty()) { //retuns an array of errors
  //   return res.status(400).json({data:{ errors: errors.array() }});
  // }
  next();
}
function checkID(){
  return check('id', 'Invalid ID').isMongoId();
} 



export {validateInput,checkID}
