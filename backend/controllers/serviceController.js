const Service = require("../models/Service");

class ServiceController {
  // Create a new service
  static async createService(req, res) {
    try {
      const {
        title,
        description,
        price,
        category,
        duration,
        availability,
        location,
        tags,
      } = req.body;

      // Validate required fields
      if (!title || !description || !price || !category) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Create service
      const service = await Service.create({
        title,
        description,
        price,
        category,
        duration,
        availability,
        location,
        tags,
        provider: req.user.id,
        status: "active",
      });

      // Populate provider details
      await service.populate("provider", "name email");

      res.status(201).json({
        success: true,
        service,
      });
    } catch (error) {
      console.error("Error in createService:", error);
      res.status(500).json({
        success: false,
        message: "Error creating service",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get all services with filters
  static async getServices(req, res) {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        location,
        availability,
        status,
        provider,
        search,
        sort = "-createdAt",
        page = 1,
        limit = 10,
      } = req.query;

      // Build query
      let query = {};

      // Add filters
      if (category) query.category = category;
      if (location) query.location = new RegExp(location, "i");
      if (availability) query.availability = availability;
      if (status) query.status = status;
      if (provider) query.provider = provider;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { title: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
          { tags: new RegExp(search, "i") },
        ];
      }

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);

      // Execute query with pagination
      const services = await Service.find(query)
        .populate("provider", "name email")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      // Get total count for pagination
      const total = await Service.countDocuments(query);

      res.json({
        success: true,
        count: services.length,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        services,
      });
    } catch (error) {
      console.error("Error in getServices:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching services",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get single service by ID
  static async getServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id).populate(
        "provider",
        "name email"
      );

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.json({
        success: true,
        service,
      });
    } catch (error) {
      console.error("Error in getServiceById:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching service",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Update service
  static async updateService(req, res) {
    try {
      const {
        title,
        description,
        price,
        category,
        duration,
        availability,
        location,
        tags,
        status,
      } = req.body;

      // Find service and check ownership
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      // Check if user is the service provider
      if (service.provider.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this service",
        });
      }

      // Update service
      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          price,
          category,
          duration,
          availability,
          location,
          tags,
          status,
        },
        { new: true, runValidators: true }
      ).populate("provider", "name email");

      res.json({
        success: true,
        service: updatedService,
      });
    } catch (error) {
      console.error("Error in updateService:", error);
      res.status(500).json({
        success: false,
        message: "Error updating service",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Delete service
  static async deleteService(req, res) {
    try {
      // Find service and check ownership
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      // Check if user is the service provider
      if (service.provider.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this service",
        });
      }

      await service.remove();

      res.json({
        success: true,
        message: "Service deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteService:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting service",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get provider's services
  static async getProviderServices(req, res) {
    try {
      const services = await Service.find({ provider: req.user.id }).populate(
        "provider",
        "name email"
      );

      res.json({
        success: true,
        count: services.length,
        services,
      });
    } catch (error) {
      console.error("Error in getProviderServices:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching provider services",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Toggle service status
  static async toggleServiceStatus(req, res) {
    try {
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      if (service.provider.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this service",
        });
      }

      service.status = service.status === "active" ? "inactive" : "active";
      await service.save();

      res.json({
        success: true,
        service,
      });
    } catch (error) {
      console.error("Error in toggleServiceStatus:", error);
      res.status(500).json({
        success: false,
        message: "Error toggling service status",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Search services
  static async searchServices(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const services = await Service.find({
        $or: [
          { title: new RegExp(query, "i") },
          { description: new RegExp(query, "i") },
          { tags: new RegExp(query, "i") },
        ],
      }).populate("provider", "name email");

      res.json({
        success: true,
        count: services.length,
        services,
      });
    } catch (error) {
      console.error("Error in searchServices:", error);
      res.status(500).json({
        success: false,
        message: "Error searching services",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = ServiceController;
