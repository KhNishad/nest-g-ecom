// src/helpers/image-upload.helper.ts
import * as fs from 'fs';
import * as path from 'path';

export interface ImageUploadResult {
  filePath: string;
  fileName: string;
  mimeType: string;
}

export function saveBase64Image(
  base64Image: string,
  uploadDir: string = 'uploads',
  fileName?: string,
): ImageUploadResult {
  // 1. Validate and parse base64 string
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const extension = mimeType.split('/')[1];

  // 2. Generate unique file name
  const uniqueFileName = fileName
    ? `${Date.now()}-${fileName}`
    : `${Date.now()}.${extension}`;

  // 3. Ensure upload directory exists
  const absoluteDir = path.join(process.cwd(), uploadDir);
  if (!fs.existsSync(absoluteDir)) {
    fs.mkdirSync(absoluteDir, { recursive: true });
  }

  // 4. Decode base64 and write to disk
  const buffer = Buffer.from(base64Data, 'base64');
  const absolutePath = path.join(absoluteDir, uniqueFileName);
  fs.writeFileSync(absolutePath, buffer);

  return {
    filePath: `/${uploadDir}/${uniqueFileName}`,  // relative/public URL
    fileName: uniqueFileName,
    mimeType,
  };
}

export function deleteImage(filePath: string): void {
  const absolutePath = path.join(process.cwd(), filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}