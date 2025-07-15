import doctorModel from "../models/doctorModel.js";

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true } 
    );

    res.json({ success: true, message: "Availability Updated", updated: updatedDoctor });
  } catch (error) {
    console.error("Error in changeAvailablity:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const doctorList=async(req,res)=>{
  try{
    const doctors=await doctorModel.find({}).select(['-password','-email'])
    res.json({success:true,doctors})
  }
  catch(error)
  {
    console.log(error)
    res.json({success:false,message:"Internal Server Error"})
  }
}

export { changeAvailablity,doctorList };
