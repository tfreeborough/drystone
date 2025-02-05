import { Asset } from "shared/types";

class AssetDBService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = "AssetStore";

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create store with compound index of applicationId and asset id
        const store = db.createObjectStore("assets", {
          keyPath: ["applicationId", "id"],
        });
        store.createIndex("applicationId", "applicationId", { unique: false });
      };
    });
  }

  async saveAsset(asset: Asset): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["assets"], "readwrite");
      const store = transaction.objectStore("assets");
      const request = store.put(asset);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAsset(
    applicationId: string,
    assetId: string,
  ): Promise<Asset | undefined> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["assets"], "readonly");
      const store = transaction.objectStore("assets");
      const request = store.get([applicationId, assetId]);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllAssetsForApplication(applicationId: string): Promise<Asset[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["assets"], "readonly");
      const store = transaction.objectStore("assets");
      const index = store.index("applicationId");
      const request = index.getAll(applicationId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAsset(applicationId: string, assetId: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["assets"], "readwrite");
      const store = transaction.objectStore("assets");
      const request = store.delete([applicationId, assetId]);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const AssetDB = new AssetDBService();
