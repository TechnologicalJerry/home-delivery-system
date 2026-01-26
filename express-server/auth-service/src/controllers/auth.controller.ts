import { Request, Response } from 'express';
import { AuthService, RegisterInput, LoginInput } from '../services/auth.service';
import { z } from 'zod';

const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.register(validated as RegisterInput);

    res.status(201).json({
      success: true,
      data: result,
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

    res.status(400).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: error.message || 'Registration failed',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.login(validated as LoginInput);

    res.json({
      success: true,
      data: result,
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

    res.status(401).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: error.message || 'Login failed',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Refresh token is required',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        code: 'REFRESH_FAILED',
        message: error.message || 'Token refresh failed',
      },
      timestamp: new Date().toISOString(),
    });
  }
};
