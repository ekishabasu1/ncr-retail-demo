import CatalogForm from '../../../components/admin/CatalogForm';
import { getAllCategoryNodes } from '../../../lib/category';

const Edit = ({ id, categoryNodes }) => {
  return (
    <CatalogForm id={id} categories={categoryNodes} />
  )
}

export async function getServerSideProps(context) {
  const categoryNodes = await getAllCategoryNodes();
  console.log(categoryNodes);
  return {
    props: {
      id: context.params.id,
      categoryNodes
    }
  }
}


export default Edit;