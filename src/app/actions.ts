"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const CorrectionReportSchema = z.object({
  variantId: z.string().min(1, "Vehicle variant ID required"),
  fieldReported: z.string().min(1, "Please select the incorrect field"),
  description: z
    .string()
    .min(10, "Please provide at least 10 characters explaining what is incorrect"),
  suggestedCorrection: z
    .string()
    .min(3, "Please provide the correct value or source reference"),
  sourceUrl: z.string().url("Must be a valid HTTP(S) URL").optional().or(z.literal("")),
  userEmail: z.string().email("Please provide a valid email").optional().or(z.literal("")),
});

export type CorrectionReportInput = z.infer<typeof CorrectionReportSchema>;

export async function submitCorrectionReportAction(
  data: CorrectionReportInput
) {
  const parsed = CorrectionReportSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  try {
    const existingVariant = await prisma.variant.findUnique({
      where: { id: data.variantId },
    });

    if (!existingVariant) {
      return {
        success: false,
        error: "Vehicle variant not found in catalog.",
      };
    }

    const report = await prisma.correctionReport.create({
      data: {
        variantId: data.variantId,
        fieldReported: data.fieldReported,
        description: data.description,
        suggestedCorrection: data.suggestedCorrection,
        sourceUrl: data.sourceUrl || null,
        userEmail: data.userEmail || null,
        status: "PENDING",
      },
    });

    return {
      success: true,
      message:
        "Thank you! Your correction report has been logged and submitted to the RASTA editorial team.",
      reportId: report.id,
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || "Failed to submit correction report.",
    };
  }
}
