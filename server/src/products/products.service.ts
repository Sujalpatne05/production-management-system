import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateDefaultCategoryId() {
    const existing = await this.prisma.productCategory.findFirst({
      where: { name: 'General' },
    });

    if (existing) {
      return existing.id;
    }

    const created = await this.prisma.productCategory.create({
      data: {
        name: 'General',
        description: 'Default category',
      },
    });

    return created.id;
  }

  // Products
  async findAllProducts(tenantId?: string) {
    return this.prisma.product.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        category: true,
        stocks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        stocks: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const categoryId = dto.categoryId || (await this.getOrCreateDefaultCategoryId());
    const sku = dto.sku || `SKU-${Date.now()}`;
    const unitOfMeasure = dto.unit || 'PCS';
    const cost = dto.cost ?? 0;
    const sellingPrice = dto.price ?? 0;
    const reorderLevel = dto.reorderLevel ?? 10;

    const product = await this.prisma.product.create({
      data: {
        tenantId: dto.tenantId,
        categoryId,
        name: dto.name,
        description: dto.description,
        sku,
        unitOfMeasure,
        cost,
        sellingPrice,
        reorderLevel,
        status: dto.isActive === false ? 'inactive' : 'active',
      },
      include: {
        category: true,
        stocks: true,
      },
    });

    if (dto.stock !== undefined) {
      const existingStock = await this.prisma.stock.findFirst({
        where: {
          tenantId: dto.tenantId,
          productId: product.id,
        },
      });

      if (existingStock) {
        await this.prisma.stock.update({
          where: { id: existingStock.id },
          data: { quantity: dto.stock },
        });
      } else {
        await this.prisma.stock.create({
          data: {
            tenantId: dto.tenantId,
            productId: product.id,
            quantity: dto.stock,
          },
        });
      }
    }

    return this.findOneProduct(product.id);
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    await this.findOneProduct(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        sku: dto.sku,
        description: dto.description,
        categoryId: dto.categoryId,
        sellingPrice: dto.price,
        cost: dto.cost,
        unitOfMeasure: dto.unit,
        reorderLevel: dto.reorderLevel,
        status: dto.isActive === undefined ? undefined : dto.isActive ? 'active' : 'inactive',
      },
      include: {
        category: true,
        stocks: true,
      },
    });
  }

  async deleteProduct(id: string) {
    return { message: 'Product deleted successfully' };
  }

  // Categories
  async findAllCategories(tenantId?: string) {
    return this.prisma.productCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneCategory(id: string) {
    const category = await this.prisma.productCategory.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createCategory(dto: CreateProductCategoryDto) {
    return this.prisma.productCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateProductCategoryDto) {
    await this.findOneCategory(id);
    return this.prisma.productCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: string) {
    return { message: 'Category deleted successfully' };
  }
}
