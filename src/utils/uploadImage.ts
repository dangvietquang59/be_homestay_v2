import cloudinary from "../config/cloudinary.config";

interface UploadResponse {
  url: string;
  public_id: string;
}

interface UploadResult {
  success: boolean;
  file: {
    originalname: string;
    size: number;
  };
  result?: UploadResponse;
  error?: string;
}

/**
 * Upload an image to Cloudinary
 * @param file Image file buffer
 * @param folder Folder name in Cloudinary (optional)
 * @returns Promise with upload response containing url and public_id
 */
export const uploadImage = async (
  file: Express.Multer.File,
  folder: string = "homestay"
): Promise<UploadResponse> => {
  try {
    // Convert the buffer to base64
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: folder,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Upload multiple images to Cloudinary with individual error handling
 * @param files Array of image files
 * @param folder Folder name in Cloudinary (optional)
 * @returns Promise with array of upload results including success/failure status for each file
 */
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string = "homestay"
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];

  for (const file of files) {
    try {
      const uploadResult = await uploadImage(file, folder);
      results.push({
        success: true,
        file: {
          originalname: file.originalname,
          size: file.size,
        },
        result: uploadResult,
      });
    } catch (error) {
      results.push({
        success: false,
        file: {
          originalname: file.originalname,
          size: file.size,
        },
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }

  return results;
};

/**
 * Delete an image from Cloudinary
 * @param public_id Public ID of the image to delete
 */
export const deleteImage = async (public_id: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image");
  }
};
