export interface CRUD {
    create: (resource: any) => Promise<any>;
    read: (name: string) => Promise<any>;
    update: (id: string, resource: any) => Promise<any>;
    delete: (resource: any) => Promise<any>;
}