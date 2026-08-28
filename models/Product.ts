import mongoose, { Schema, Model } from "mongoose";

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductDetails {
  frameColor: string;
  lensColor: string;
  material: string;
  protection: string;
  dimensions: string;
}

export interface IProduct {
  title: string;
  slug: string;
  description: string;

  price: number;

  images: ProductImage[];

  rating: number;

  category: string;

  stock: number;
  inStock: boolean;

  details: ProductDetails;

  collectionId?: mongoose.Types.ObjectId;
}

const ProductImageSchema = new Schema<ProductImage>(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const ProductDetailsSchema = new Schema<ProductDetails>(
  {
    frameColor: {
      type: String,
      required: true,
      trim: true,
    },

    lensColor: {
      type: String,
      required: true,
      trim: true,
    },

    material: {
      type: String,
      required: true,
      trim: true,
    },

    protection: {
      type: String,
      required: true,
      trim: true,
    },

    dimensions: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    images: {
      type: [ProductImageSchema],
      required: true,
      default: [],
      validator: function (images: ProductImage[]) {
        return images.length <= 4;
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    inStock: {
      type: Boolean,
      default: false,
    },

    details: {
      type: ProductDetailsSchema,
      required: true,
    },

    collectionId: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Automatically determine whether the product is in stock.
 */
ProductSchema.pre("save", function () {
  this.inStock = this.stock > 0;
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
