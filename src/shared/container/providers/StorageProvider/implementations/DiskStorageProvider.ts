import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    // verifica se o arquivo existe, e caso não exista retorna um erro que
    // pegamo no catch
    try {
      await fs.promises.stat(filePath);
    } catch (err) {
      throw new AppError(err);
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
