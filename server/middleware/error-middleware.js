export const errormiddleware = async(err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Error from backend"
    const extradetails = err.extradetails || "Backend error"
    return res.status(status).json({message,extradetails})
}
