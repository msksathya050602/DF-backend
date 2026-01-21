import { Branch } from "@/entities/Branch";

export class BranchService {
  static async getAllBranches(): Promise<Branch[]> {
    return await Branch.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  static async getBranchById(id: string): Promise<Branch | null> {
    return await Branch.findOne({ where: { id } });
  }

  static async createBranch(data: {
    name: string;
    address?: string;
    phone?: string;
  }): Promise<Branch> {
    const branch = Branch.create({
      name: data.name,
      address: data.address,
      phone: data.phone,
      isActive: true,
    });
    return await branch.save();
  }

  static async updateBranch(
    id: string,
    data: {
      name?: string;
      address?: string;
      phone?: string;
      isActive?: boolean;
    },
  ): Promise<Branch> {
    const branch = await Branch.findOne({ where: { id } });
    if (!branch) {
      throw new Error("Branch not found");
    }
    Object.assign(branch, data);
    return await branch.save();
  }

  static async deleteBranch(id: string): Promise<void> {
    const branch = await Branch.findOne({ where: { id } });
    if (!branch) {
      throw new Error("Branch not found");
    }
    branch.isActive = false;
    await branch.save();
  }
}
