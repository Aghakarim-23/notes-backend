import { User } from "../models/User.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (users.length === 0) {
      res.status(404).json("Users not found");
    }
    res.status(200).json({
      data: {
        count: users.length,
        users,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req,res) => {
  try {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id)
    if(!user) return res.status(404).json({message: "User is not found"})
    res.status(200).json({message: "User deleted successfully", deletedUser: user})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" });

  }
} 

export const editRoleUser = async (req,res) => {
  const {id} = req.params;
  const {role} = req.body;
  try {
    if(req.user.role !== "admin") return res.status(403).json({message: "Only admin can access this route"}) // I prevented this both side front and back side
    
    if(req.user.id === id) return res.status(403).json({message: "User cannot change own role"})

    const updatedUserRole = await User.findByIdAndUpdate(id, {role}, {new: true})

    if (!updatedUserRole) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({message: "User role updated successfully", updatedUserRole})


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
