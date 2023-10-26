import httpErrors from "../constant.js"
export const pageNotFound = (req,res,next) => {
    const error = new Error(`page not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

export const error = (err, req, res, next) => {
const statusCode = res.statusCode ? res.statusCode : 500

if(err){
    switch (statusCode) {
        case httpErrors.VALIDATION_ERROR:
            res.json({title:"Vaidation Failed",message: err.message, stackTrace: err.stack});
            break;
        case httpErrors.NOT_FOUND:
            res.json({title:"Not found",message: err.message, stackTrace: err.stack});
            break;
        case httpErrors.FORBIDDEN:
            res.json({title:"forbidden",message: err.message, stackTrace: err.stack});
            break;
        case httpErrors.UNAUTHORIZED:
            res.json({title:"Unautorized",message: err.message, stackTrace: err.stack});
            break;
        case httpErrors.SERVER_ERROR:
            res.json({title:"server error",message: err.message, stackTrace: err.stack});
            break;
    
        default:
            break;
    }}
}