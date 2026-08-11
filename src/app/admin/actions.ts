"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  BrandSchema,
  type BrandInput,
  VehicleSchema,
  type VehicleInput,
} from "@/lib/validations";
import { requireAuth } from "@/lib/auth";

export async function createBrandAction(data: BrandInput) {
  let session;
  try {
    session = await requireAuth(["EDITOR", "ADMIN"]);
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  const parsed = BrandSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  try {
    const created = await prisma.brand.create({
      data: {
        name: data.name,
        slug,
        logoInitial: data.logoInitial,
        color: data.color,
        country: data.country,
        description: data.description,
        isPakistaniAssembled: data.isPakistaniAssembled,
        parentCompany: data.parentCompany || null,
        logoUrl: data.logoUrl || null,
        officialWebsite: data.officialWebsite || null,
        pakistanDistributor: data.pakistanDistributor || null,
        isActive: data.isActive !== false,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
        action: "CREATE_BRAND",
        entity: "Brand",
        entityId: created.id,
        newValue: JSON.stringify(created),
      },
    });

    revalidatePath("/brands");
    revalidatePath("/admin");
    return { success: true, brand: created };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to create brand" };
  }
}

export async function createVehicleAction(data: VehicleInput) {
  let session;
  try {
    session = await requireAuth(["EDITOR", "ADMIN"]);
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  const parsed = VehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const brand = await prisma.brand.findUnique({
      where: { name: data.brandName },
    });
    if (!brand) {
      return { success: false, error: `Brand ${data.brandName} not found` };
    }

    const modelSlug = `${data.brandName.toLowerCase()}-${data.modelName.toLowerCase()}`.replace(
      /[^a-z0-9]+/g,
      "-"
    );
    let model = await prisma.model.findUnique({ where: { slug: modelSlug } });
    if (!model) {
      model = await prisma.model.create({
        data: {
          brandId: brand.id,
          name: data.modelName,
          slug: modelSlug,
          bodyType: data.bodyType,
          popularityScore: data.isPopular ? 90 : 75,
        },
      });
    }

    const variantSlug = `${modelSlug}-${data.variantName.toLowerCase()}`.replace(
      /[^a-z0-9]+/g,
      "-"
    );

    const createdVariant = await prisma.variant.create({
      data: {
        id: variantSlug,
        modelId: model.id,
        name: data.variantName,
        slug: variantSlug,
        variantCount: 1,
        priceMinLakh: data.priceMinLakh,
        priceMaxLakh: data.priceMaxLakh,
        badge: data.badge || "New",
        bodyType: data.bodyType,
        fuelType: data.fuelType,
        engine: data.engine,
        transmission: data.transmission,
        seating: data.seating,
        mileageKmpl: data.mileageKmpl || null,
        powerHp: data.powerHp,
        torqueNm: data.torqueNm,
        airbags: data.airbags,
        colors: JSON.stringify(["Titanium Grey", "Pearl White", "Sparkling Black"]),
        isFeatured: data.isFeatured,
        isPopular: data.isPopular,
        isRecentlyAdded: data.isRecentlyAdded,
        releaseYear: 2026,
        status: "CURRENT",
        publicationStatus: "PUBLISHED",
        sourceType: "OFFICIAL_ASSEMBLER",
        verificationStatus: "VERIFIED",
      },
    });

    await prisma.specification.create({
      data: {
        variantId: createdVariant.id,
        engineDesc: data.engine,
        transmissionType: data.transmission,
        horsepower: data.powerHp,
        torqueNm: data.torqueNm,
        seatingCapacity: data.seating,
        airbagsCount: data.airbags,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
        action: "CREATE_VEHICLE",
        entity: "Variant",
        entityId: createdVariant.id,
        newValue: JSON.stringify(createdVariant),
      },
    });

    revalidatePath("/cars");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, variant: createdVariant };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || "Failed to save vehicle variant",
    };
  }
}

export async function deleteVehicleAction(id: string) {
  let session;
  try {
    // Destructive operations require ADMIN role
    session = await requireAuth(["ADMIN"]);
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  if (!id) return { success: false, error: "Missing vehicle ID" };

  try {
    const existing = await prisma.variant.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Vehicle not found in database" };
    }

    await prisma.variant.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
        action: "DELETE_VEHICLE",
        entity: "Variant",
        entityId: id,
        previousValue: JSON.stringify(existing),
      },
    });

    revalidatePath("/cars");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || "Failed to delete vehicle record",
    };
  }
}

export async function updatePriceAction(
  variantId: string,
  priceMinLakh: number,
  priceMaxLakh: number,
  note: string
) {
  let session;
  try {
    session = await requireAuth(["EDITOR", "ADMIN"]);
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  if (priceMinLakh <= 0 || priceMaxLakh < priceMinLakh) {
    return { success: false, error: "Invalid Ex-Factory price range." };
  }

  try {
    const prev = await prisma.variant.findUnique({ where: { id: variantId } });
    if (!prev) {
      return { success: false, error: "Variant not found" };
    }

    const updated = await prisma.variant.update({
      where: { id: variantId },
      data: {
        priceMinLakh,
        priceMaxLakh,
        lastVerified: new Date().toISOString().slice(0, 10),
      },
    });

    await prisma.priceHistory.create({
      data: {
        variantId,
        year: 2026,
        month: 8,
        priceLakh: priceMinLakh,
        priceType: "EX_FACTORY",
        currency: "PKR",
        source: "ADMIN_UPDATE",
        note: note || "Revised sticker price",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
        action: "UPDATE_PRICE",
        entity: "Variant",
        entityId: variantId,
        previousValue: JSON.stringify({
          min: prev.priceMinLakh,
          max: prev.priceMaxLakh,
        }),
        newValue: JSON.stringify({ min: priceMinLakh, max: priceMaxLakh, note }),
      },
    });

    revalidatePath("/cars");
    revalidatePath("/admin");
    revalidatePath(`/cars/${variantId}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to update price" };
  }
}

export async function reviewCorrectionReportAction(
  reportId: string,
  status: "APPROVED" | "REJECTED",
  adminNote?: string
) {
  let session;
  try {
    session = await requireAuth(["EDITOR", "ADMIN"]);
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  try {
    const updated = await prisma.correctionReport.update({
      where: { id: reportId },
      data: {
        status,
        adminNote: adminNote || null,
        reviewedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
        action: `REVIEW_CORRECTION_${status}`,
        entity: "CorrectionReport",
        entityId: reportId,
        newValue: JSON.stringify(updated),
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to review correction report" };
  }
}

export async function manageImageAction(
  imageId: string,
  data: {
    url?: string;
    altText?: string;
    isPrimary?: boolean;
    sourceUrl?: string;
    sourceName?: string;
    sourceType?: string;
    imageType?: string;
    imageMatchLevel?: string;
    verificationStatus?: string;
    copyrightNotice?: string;
    license?: string;
    isVerified?: boolean;
  }
) {
  let session;
  try {
    session = await requireAuth(["EDITOR", "ADMIN"]);
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  try {
    const prev = await prisma.image.findUnique({ where: { id: imageId } });
    if (!prev) return { success: false, error: "Image record not found" };

    if (data.isPrimary) {
      await prisma.image.updateMany({
        where: { variantId: prev.variantId },
        data: { isPrimary: false },
      });
    }

    const updated = await prisma.image.update({
      where: { id: imageId },
      data: {
        ...(data.url && { url: data.url }),
        ...(data.altText !== undefined && { altText: data.altText }),
        ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary }),
        ...(data.sourceUrl !== undefined && { sourceUrl: data.sourceUrl }),
        ...(data.sourceName !== undefined && { sourceName: data.sourceName }),
        ...(data.sourceType !== undefined && { sourceType: data.sourceType }),
        ...(data.imageType !== undefined && { imageType: data.imageType }),
        ...(data.imageMatchLevel !== undefined && { imageMatchLevel: data.imageMatchLevel }),
        ...(data.verificationStatus !== undefined && { verificationStatus: data.verificationStatus }),
        ...(data.copyrightNotice !== undefined && { copyrightNotice: data.copyrightNotice }),
        ...(data.license !== undefined && { license: data.license }),
        ...(data.isVerified !== undefined && { isVerified: data.isVerified }),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
        action: "MANAGE_IMAGE",
        entity: "Image",
        entityId: imageId,
        previousValue: JSON.stringify(prev),
        newValue: JSON.stringify(updated),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/cars");
    return { success: true, image: updated };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to update image" };
  }
}
