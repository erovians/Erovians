import TeamMember from "../models/team.model.js";

/* --------------------- CREATE MEMBER --------------------- */
export const addTeamMember = async (req, res) => {
  try {
    const { name, role, site } = req.body;

    const member = await TeamMember.create({
      name,
      role,
      site,
      sellerId: req.user.userId,
    });

    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* --------------------- GET MEMBERS --------------------- */
export const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({
      sellerId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* --------------------- UPDATE MEMBER --------------------- */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, site, lastActive } = req.body;

    const updated = await TeamMember.findOneAndUpdate(
      { _id: id, sellerId: req.user.userId },
      { name, role, site, lastActive },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    res.status(200).json({ success: true, member: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* --------------------- DELETE MEMBER --------------------- */
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TeamMember.findOneAndDelete({
      _id: id,
      sellerId: req.user.userId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
