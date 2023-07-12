import { Complain, Order, Transaction, User, Shop, Product } from "@prisma/client";

export type getDataComplain = Complain & {
  order:Order & {
    transaction: Transaction &{
      user:User;
      shop:Shop;
    }
    product: Product
  }
}

// export type getTypeTransactions = Transaction & {
//   order: (Order & {
//     complain: Complain;
//   })[];
// };
export type getTypeTransactions = Transaction & {
  order:Order[] & {
    Complain: Complain
  }
}