import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';

const userService = new UserService();

// Extract userId from header (set by API Gateway)
const getUserId = (req: Request): string => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    throw new Error('User ID not found in request');
  }
  return userId;
};

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }).optional(),
  preferences: z.record(z.any()).optional(),
});

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const profile = await userService.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'User profile not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to get profile',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const validated = updateProfileSchema.parse(req.body);
    const profile = await userService.updateUserProfile(userId, validated);

    res.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: error.message || 'Failed to update profile',
      },
      timestamp: new Date().toISOString(),
    });
  }
};
