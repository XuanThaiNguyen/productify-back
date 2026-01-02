import {
  type NewUser,
  type NewProduct,
  type NewComment,
  users,
  products,
  comments,
} from "./schema";
import { db } from "./index";
import { eq } from "drizzle-orm";

export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  return user;
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
};

export const upsertUser = async (data: NewUser) => {
  // const existingUser = await getUserById(data.id);
  // if (existingUser) {
  //   return await updateUser(data.id, data);
  // }
  // return await createUser(data);

  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning();

  return user;
};

export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProducts = async () => {
  const products = await db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
  return products;
};

export const getProductById = async (id: string) => {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
  return product;
};

export const getProductsByUserId = async (userId: string) => {
  const allProducts = await db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return allProducts;
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return product;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
  return comment;
};

export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    throw new Error("Comment not found");
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};
