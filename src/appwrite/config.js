import conf from "../conf/conf";
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    tablesDB;
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.tablesDB = new TablesDB(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteTableId,
                rowId: slug || ID.unique(),
                data: {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            });
        } catch (error) {
            console.log("createPost error:", error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteTableId,
                rowId: slug,
                data: {
                    title,
                    content,
                    featuredImage,
                    status
                }
            });
        } catch (error) {
            console.log("updatePost error:", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.tablesDB.deleteRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteTableId,
                rowId: slug
            });
            return true;
        } catch (error) {
            console.log("deletePost error:", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteTableId,
                rowId: slug
            });
        } catch (error) {
            console.log("getPost error:", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteTableId,
                queries
            });
        } catch (error) {
            console.log("getPosts error:", error);
            return false;
        }
    }

    async uploadFile(file) {
    try {
        return await this.storage.createFile({
            bucketId: conf.appwriteBucketId,
            fileId: ID.unique(),
            file: file
        });
    } catch (error) {
        console.log("uploadFile error:", error);
        return false;
    }
}

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile({
                bucketId: conf.appwriteBucketId,
                fileId: fileId
            });
            return true;
        } catch (error) {
            console.log("deleteFile error:", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.storage.getFilePreview({
            bucketId: conf.appwriteBucketId,
            fileId: fileId
        }
        );
    }
}

const service = new Service();
export default service;