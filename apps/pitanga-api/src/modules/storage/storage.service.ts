/**
 * Storage service for file upload and management.
 * Currently uses local storage, can be extended for S3/R2.
 *
 * @author Luiz Gama
 */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';
import {
  FileValidationResult,
  generateUniqueFilename,
  validateFile,
} from './utils/file-validators';

export interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface StoredFile {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  fileType: 'image' | 'video';
}

@Injectable()
export class StorageService {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Default to local uploads directory
    this.uploadDir = this.configService.get<string>(
      'UPLOAD_DIR',
      path.join(process.cwd(), 'uploads'),
    );
    this.baseUrl = this.configService.get<string>(
      'STORAGE_BASE_URL',
      '/uploads',
    );

    // Ensure upload directory exists
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    const dirs = [
      this.uploadDir,
      path.join(this.uploadDir, 'images'),
      path.join(this.uploadDir, 'videos'),
      path.join(this.uploadDir, 'thumbnails'),
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Validate a file before upload
   */
  validate(file: UploadedFile): FileValidationResult {
    return validateFile(file.mimetype, file.size);
  }

  /**
   * Upload a file to storage
   */
  upload(file: UploadedFile, tenantId: string): Observable<StoredFile> {
    // Validate file
    const validation = this.validate(file);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join('; '));
    }

    const fileType = validation.fileType!;
    const filename = generateUniqueFilename(file.originalname, file.mimetype);
    const subDir = fileType === 'image' ? 'images' : 'videos';
    const tenantDir = path.join(this.uploadDir, subDir, tenantId);

    // Ensure tenant directory exists
    if (!fs.existsSync(tenantDir)) {
      fs.mkdirSync(tenantDir, { recursive: true });
    }

    const filePath = path.join(tenantDir, filename);

    return from(fs.promises.writeFile(filePath, file.buffer)).pipe(
      map(() => ({
        url: `${this.baseUrl}/${subDir}/${tenantId}/${filename}`,
        filename,
        mimeType: file.mimetype,
        size: file.size,
        fileType,
      })),
      catchError((error) => {
        throw new InternalServerErrorException(
          `Failed to save file: ${error.message}`,
        );
      }),
    );
  }

  /**
   * Delete a file from storage
   */
  delete(fileUrl: string): Observable<boolean> {
    // Extract path from URL
    const relativePath = fileUrl.replace(this.baseUrl, '');
    const filePath = path.join(this.uploadDir, relativePath);

    if (!fs.existsSync(filePath)) {
      return of(true); // File doesn't exist, nothing to delete
    }

    return from(fs.promises.unlink(filePath)).pipe(
      map(() => true),
      catchError((error) => {
        throw new InternalServerErrorException(
          `Failed to delete file: ${error.message}`,
        );
      }),
    );
  }

  /**
   * Get file info
   */
  getFileInfo(fileUrl: string): Observable<{ exists: boolean; size?: number }> {
    const relativePath = fileUrl.replace(this.baseUrl, '');
    const filePath = path.join(this.uploadDir, relativePath);

    return from(
      new Promise<{ exists: boolean; size?: number }>((resolve) => {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            resolve({ exists: false });
          } else {
            resolve({ exists: true, size: stats.size });
          }
        });
      }),
    );
  }

  /**
   * Generate thumbnail URL (placeholder for actual thumbnail generation)
   * TODO: Implement actual thumbnail generation with Sharp
   */
  getThumbnailUrl(fileUrl: string, fileType: 'image' | 'video'): string {
    // For now, return a placeholder or the original image
    // In production, this should generate actual thumbnails
    if (fileType === 'image') {
      // For images, we could return a resized version
      return fileUrl.replace('/images/', '/thumbnails/');
    }
    // For videos, we'd need to extract a frame
    return fileUrl
      .replace('/videos/', '/thumbnails/')
      .replace(/\.\w+$/, '.jpg');
  }
}
