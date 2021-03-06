import { getAllCategoryNodes } from '~/lib/category';

export default async function handler(req, res) {
  const categoryNodes = await getAllCategoryNodes(true);
  res.json({ status: 200, categoryNodes });
}
