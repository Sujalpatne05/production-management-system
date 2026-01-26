import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.productsService.findAllProducts(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}

@Controller('product-categories')
@UseGuards(JwtAuthGuard)
export class ProductCategoriesController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.productsService.findAllCategories(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOneCategory(id);
  }

  @Post()
  create(@Body() dto: CreateProductCategoryDto) {
    return this.productsService.createCategory(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
    return this.productsService.updateCategory(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.deleteCategory(id);
  }
}
