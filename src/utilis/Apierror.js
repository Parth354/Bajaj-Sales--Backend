class Apierror extends Error{
   constructor(
    statusCode,
    message="Something went Wrong",
    errors=[],
    stack=""
   ){
    super(message)
    this.statusCode=statusCode
    this.data=null
    this.message=message
    this.success=false
    this.errors=errors

    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
   }
}
function errorHandler(err, req, res, next) {
    if (err instanceof Apierror) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    } else {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export {Apierror,errorHandler} 