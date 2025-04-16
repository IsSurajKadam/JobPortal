export const sendToken=(user,statusCode,res,message)=>
{
  const token=user.getJWTToken();
  const options={
    expire:new Date(
      Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
    ),
    httpOnly:true,
    path:"/"
  }
  res.status(statusCode).cookie("token",token,options).json(
    {
      success:true,
      user,
      message,
      token
    }
  )
}