import React from 'react';
import Header from '../../components/public/Header';
import Link from 'next/link';
import ItemCard from '../../components/public/ItemCard';
import {
  Card, Col, Row, CardBody, CardDeck
} from 'reactstrap';
import useCategory from '../../context/useCategory';
import { useContext } from 'react';
import { UserStoreContext } from '../../context/AppContext';

export default function Category({ id, categories }) {

  const { userStore } = useContext(UserStoreContext);
  const { data, isLoading, isError } = useCategory(id, userStore.id);
  let category, childrenCategories, categoryItems;
  if (!isLoading && !isError) {
    category = data.category;
    childrenCategories = data.childrenCategories;
    if (data.categoryItems.data && data.categoryItems.data.pageContent) {
      categoryItems = data.categoryItems.data.pageContent;
    } else {
      categoryItems = data.categoryItems;
    }
  }
  let columns = 6;
  if (childrenCategories && childrenCategories.data.pageContent.length > 0) {
    let length = childrenCategories.data.pageContent.length;
    switch (length) {
      case 2:
        columns = 6;
        break;
      case 3:
        columns = 4;
        break;
      case 4:
        columns = 3
        break;
      default:
        columns = 2
        break;
    }
  }
  return (
    <div>
      <Header categories={categories} />
      <div className="container mt-4">
        {isLoading && <div />}
        {isError && <p>Error</p>}
        {!isLoading && !isError && (
          <div>
            {/* <h1>{category && category.data && category.data.title.values[0].value}</h1> */}
            {childrenCategories.data.pageContent.length > 0 && (
              <Row>
                {childrenCategories.data.pageContent.map((child) => (
                  <Col sm={columns} key={child.nodeCode}>
                    <Card className="shadow-sm p-2 bg-white rounded border-0 mb-4 category-card">

                      <Link href={`/category/${child.nodeCode}`} passHref>
                        <a>
                          <CardBody>
                            <p className='h5 card-title'>{child.title.value}</p>
                          </CardBody>
                        </a>
                      </Link>


                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            <div className="row row-cols-md-3">
              {categoryItems.length > 0 ? categoryItems.map(item => (
                <div className="col-md-6 col-lg-4 mb-4" key={item.item.itemId.itemCode}>
                  <ItemCard catalogItem={item} />
                </div>
              )) :
                <small className="col text-muted">No products yet.</small>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      id: context.params.id
    }
  }
}