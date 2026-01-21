import { Database } from '@components/database';
import { dbSource } from '@/dbConfig';
import { Branch } from '@/entities/Branch';

export class BranchService {
    private static db = Database.initialize(dbSource);

    static async getAllBranches(): Promise<Branch[]> {
        const entityManager = BranchService.db.getEntityManager();
        return await entityManager.find(Branch, {
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    static async getBranchById(id: string): Promise<Branch | null> {
        const entityManager = BranchService.db.getEntityManager();
        return await entityManager.findOne(Branch, { where: { id } });
    }

    static async createBranch(data: { name: string; address?: string; phone?: string }): Promise<Branch> {
        const entityManager = BranchService.db.getEntityManager();
        const branch = entityManager.create(Branch, {
            name: data.name,
            address: data.address,
            phone: data.phone,
            isActive: true,
        });
        return await entityManager.save(branch);
    }

    static async updateBranch(id: string, data: { name?: string; address?: string; phone?: string; isActive?: boolean }): Promise<Branch> {
        const entityManager = BranchService.db.getEntityManager();
        const branch = await entityManager.findOne(Branch, { where: { id } });
        if (!branch) {
            throw new Error('Branch not found');
        }
        Object.assign(branch, data);
        return await entityManager.save(branch);
    }

    static async deleteBranch(id: string): Promise<void> {
        const entityManager = BranchService.db.getEntityManager();
        const branch = await entityManager.findOne(Branch, { where: { id } });
        if (!branch) {
            throw new Error('Branch not found');
        }
        branch.isActive = false;
        await entityManager.save(branch);
    }
}
