import { v4 as uuidv4 } from 'uuid';

export interface StoredImage {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  data: string;
  createdAt: number;
  updatedAt: number;
}

class ImageDBServiceClass {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'ImageStore';
  private readonly STORE_NAME = 'images';

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, {
            keyPath: 'id',
          });
          // Create indexes for searching
          store.createIndex('fileName', 'fileName', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async saveImage(file: File, base64Data: string): Promise<StoredImage> {
    if (!this.db) await this.initialize();

    const imageData: StoredImage = {
      id: uuidv4(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      data: base64Data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(imageData);

      request.onsuccess = () => resolve(imageData);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllImages(): Promise<StoredImage[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getImage(id: string): Promise<StoredImage | undefined> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const ImageDBService = new ImageDBServiceClass();
