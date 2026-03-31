import { Branch } from '@/entities/Branch';

export class BranchService {
    static async getAllBranches(): Promise<Branch[]> {
        return await Branch.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    static async getBranchById(id: string): Promise<Branch | null> {
        return await Branch.findOne({ where: { id } });
    }

    static async createBranch(data: { branchName: string; branchAddress?: string; branchPhone?: string }): Promise<Branch> {
        const branch = Branch.create({
            branchName: data.branchName,
            branchAddress: data.branchAddress,
            branchPhone: data.branchPhone,
            isActive: true,
        });
        return await branch.save();
    }

    static async updateBranch(
        id: string,
        data: {
            branchName?: string;
            branchAddress?: string;
            branchPhone?: string;
            isActive?: boolean;
        },
    ): Promise<Branch> {
        const branch = await Branch.findOne({ where: { id } });
        if (!branch) {
            throw new Error('Branch not found');
        }
        Object.assign(branch, data);
        return await branch.save();
    }

    static async deleteBranch(id: string): Promise<void> {
        const branch = await Branch.findOne({ where: { id } });
        if (!branch) {
            throw new Error('Branch not found');
        }
        branch.isActive = false;
        await branch.save();
    }
}
