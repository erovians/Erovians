import Review from "../models/review.model.js"; 
import CompanyDetails from '../models/company.model.js';

export const addReview = async (req, res) => {
  try {
    const sellerId = req.user.userId; 

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Unauthorized: sellerId missing',
      });
    }

    // Find companyId based on sellerId
    const company = await CompanyDetails.findOne({ sellerId }).select('_id');

    const companyId = company?._id;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          'Company not found for this seller. Please register a company first.',
      });
    }

    // Extract other fields from request body
    const { userId, productId, rating, comment, image } = req.body;

    if (!rating || !comment || !userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, productId, rating, or comment',
      });
    }

    // Create and save the review
    const review = new Review({
      userId,
      sellerId,
      companyId,
      productId,
      rating,
      comment,
      image,
    });

    const savedReview = await review.save();

    res.status(201).json({
      success: true,
      data: savedReview,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review',
    });
  }
};

export const listAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')         // populate user info
      .populate('productId', 'name')            // populate product info
      .populate('companyId', 'companyName')     // populate company info
      .populate('sellerId', 'name email')       // populate seller info
      .sort({ createdAt: -1 });                 // newest first

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews',
    });
  }
};



// EDIT a review
export const editReview = async (req, res) => {
  try {
    const { id } = req.params; // review ID
    const updates = req.body;

    const updatedReview = await Review.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to edit review", error: error.message });
  }
};

// DELETE a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete review", error: error.message });
  }
};
