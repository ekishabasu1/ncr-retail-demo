import { useState } from 'react';
import Header from '../layouts/Header';
import useSiteCatalog from '../../../context/useSiteCatalog';
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';
import SiteCatalogTable from '../layouts/SiteCatalogTable';
// import AddItemDetailsModal from '../layouts/AddItemDetailsModal';


export default function Site({ id, categories }) {

  let { siteData, isLoading, isError } = useSiteCatalog(id);
  if (isError) {
    return (
      <div>
        <Header categories={categories} />
        <div className="container">
          <p>Error</p>
        </div>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div>
        <Header categories={categories} />
        <div className="container">
          <p>Loading</p>
        </div>
      </div>
    )
  }
  const { site, siteCatalog, catalog } = siteData;
  // const [selectedItem, setSelectedItem] = useState(false);
  console.log(siteCatalog);
  return (
    <div>
      <Header categories={categories} />

      <div className="container">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle>
                  {site.siteName}
                </CardTitle>
                <a href={`/admin/sites/addItem?id=${site.id}`}>Add Item</a>
                {/* <AddItemModal catalog={catalog} /> */}
                {/* <AddItemDetailsModal selectedItem={selectedItem} /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <SiteCatalogTable catalog={siteCatalog} setExpandRow={true} />
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