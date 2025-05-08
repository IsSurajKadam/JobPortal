class ErrorHandler extends Error {
  constructor(message,statusCode)
  {
super(message);
this.statusCode=statusCode;
  }
}
export const errorMiddleWare=(err,req,res,next)=>{
err.statusCode=err.statusCode || 500
err.message=err.message|| "Internal Server Error";

if(err.name=="CastError")
{
  const message=`Invalide ${err.path}`;
  err=new ErrorHandler(message, 400)
}
if(err.code==11000)
{
  const message=`Invalide ${err.path}`;
  err=new ErrorHandler(message, 400)
}

return res.status(err.statusCode).json({
  success:false,
  message:err.message,
  err:err
})
}
export default ErrorHandler