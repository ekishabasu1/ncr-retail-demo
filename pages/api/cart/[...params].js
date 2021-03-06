import { getCartById, getCartItemsById, deleteCart } from '~/lib/cart';

export default async function handler(req, res) {
  let siteId = req.query.params[0];
  let cartId = req.query.params[1];
  if (req.method == 'DELETE') {
    const result = await deleteCart(siteId, cartId);
    res.json(result);
  } else {
    const cart = await getCartById(siteId, cartId);
    const cartItems = await getCartItemsById(siteId, cartId);
    res.json({ cart, cartItems, status: 200 });
  }
}
