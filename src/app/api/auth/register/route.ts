import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const runtime = "edge";

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user and business owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: "business_owner",
        },
      });
      
      // Create business owner profile
      const businessOwner = await tx.businessOwner.create({
        data: {
          userId: user.id,
          businessName: validatedData.businessName,
          phoneNumber: validatedData.phoneNumber,
          address: validatedData.address,
        },
      });
      
      return { user, businessOwner };
    });
    
    // Return success response (without password)
    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      businessOwner: {
        id: result.businessOwner.id,
        businessName: result.businessOwner.businessName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}