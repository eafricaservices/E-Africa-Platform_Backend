import { Request, Response } from "express";
import User from "../model/user";
import validateUserForm, { validatePasswordUpdate } from "../helpers/validateUserForm";
import { logValidation, logDatabaseOperation } from "../middleware/logging";
import { 
    generateSecureSixDigitCode, 
    generateCodeExpiration,
    logVerificationCodeGenerated 
} from "../helpers/verificationCodes";
import { sendVerificationCodeEmail } from "../services/emailService";
import logger from "../config/logger";

// Create User
export const createUser = async (req: Request, res: Response) => {
  const validationResult = validateUserForm(req.body);
  logValidation(req, validationResult, 'createUser');

  if (!validationResult.isValid) {
    return res.status(400).json({ 
      success: false,
      errors: validationResult.errors 
    });
  }

  try {
    // Set default values for new user
    const userData = {
      ...req.body,
      isVerified: false,
      provider: 'local'
    };

    // Create the user
    const user = await User.create(userData);
    logDatabaseOperation(req, 'User.create', 'success', user);

    // Generate verification code
    const verificationCode = generateSecureSixDigitCode();
    const expirationDate = generateCodeExpiration();

    // Save verification code to user
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = expirationDate;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationCodeEmail(user.email, verificationCode, user.fullName);
    
    // Log for audit trail
    logVerificationCodeGenerated(user.userId, user.email, 'email');
    
    if (!emailResult.success) {
      logger.error('Failed to send verification email', {
        userId: user.userId,
        email: user.email,
        error: emailResult.error
      });
    }

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email for the verification code.',
      data: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    logDatabaseOperation(req, 'User.create', 'error', null, err);
    return res.status(400).json({ 
      success: false,
      message: "Failed to create user", 
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// Get All Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    logDatabaseOperation(req, 'User.find', 'success', users);
    return res.json({
      success: true,
      data: users
    });
  } catch (err) {
    logDatabaseOperation(req, 'User.find', 'error', null, err);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch users", 
      error: err instanceof Error ? err.message : err 
    });
  }
};

// Get Single User
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    logDatabaseOperation(req, 'User.findOne', 'success', user);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (err) {
    logDatabaseOperation(req, 'User.findOne', 'error', null, err);
    return res.status(500).json({ 
      success: false,
      message: "Error fetching user", 
      error: err instanceof Error ? err.message : err 
    });
  }
};

// Update User
//       message: 'Email verification failed. Please try again or request a new verification link.'
//     });
//   }
// };

export const updateUser = async (req: Request, res: Response) => {
  try {
    // Find the user first
    const user = await User.findOne({ userId: req.params.id });
    logDatabaseOperation(req, 'User.findOne', 'success', user);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Handle password update if requested
    if (req.body.currentPassword || req.body.newPassword || req.body.confirmPassword) {
      // Validate password update
      const passwordValidation = validatePasswordUpdate({
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
        confirmPassword: req.body.confirmPassword
      });
      logValidation(req, passwordValidation, 'passwordUpdate');

      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: passwordValidation.errors
        });
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(req.body.currentPassword);
      if (!isPasswordValid) {
        logger.warn('Invalid current password attempt', {
          requestId: req.logContext?.requestId,
          userId: user.userId,
          ip: req.logContext?.ip
        });
        return res.status(400).json({
          success: false,
          errors: { currentPassword: "Current password is incorrect" }
        });
      }

      // Set the new password
      user.password = req.body.newPassword;
      await user.save(); // This will trigger the password hashing middleware
      logDatabaseOperation(req, 'User.save.password', 'success', { userId: user.userId });

      // Remove password fields from the update data
      delete req.body.currentPassword;
      delete req.body.newPassword;
      delete req.body.confirmPassword;
    }

    // Validate other user data if present
    if (Object.keys(req.body).length > 0) {
      const validationResult = validateUserForm(req.body);
      logValidation(req, validationResult, 'updateUser');

      if (!validationResult.isValid) {
        return res.status(400).json({ 
          success: false,
          errors: validationResult.errors
        });
      }
    }

    // Update other user fields if any
    if (Object.keys(req.body).length > 0) {
      const updatedUser = await User.findOneAndUpdate(
        { userId: req.params.id },
        req.body,
        { new: true }
      );
      logDatabaseOperation(req, 'User.findOneAndUpdate', 'success', updatedUser);

      return res.json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
      });
    }

    // If only password was updated
    return res.json({
      success: true,
      message: "Password updated successfully",
      data: {
        userId: user.userId,
        email: user.email
      }
    });

  } catch (err) {
    logDatabaseOperation(req, 'User.update', 'error', null, err);
    return res.status(400).json({ 
      success: false,
      message: "Failed to update user", 
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ userId: req.params.id });
    logDatabaseOperation(req, 'User.findOneAndDelete', 'success', user);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    return res.json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (err) {
    logDatabaseOperation(req, 'User.findOneAndDelete', 'error', null, err);
    return res.status(500).json({ 
      success: false,
      message: "Failed to delete user", 
      error: err instanceof Error ? err.message : err 
    });
  }
};
