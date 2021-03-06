import { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import {
  Container,
  Spinner,
  Card,
  Row,
  Col,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  CardBody,
  CardSubtitle,
  CardText,
  Button,
  FormGroup,
  Input,
} from 'reactstrap';
import Header from '~/components/public/Header';
import Footer from '~/components/public/Footer';
import { UserStoreContext } from '~/context/userStore';
import { UserCartContext } from '~/context/userCart';
import useCatalogItem from '~/lib/hooks/useCatalogItem';

const CatalogItem = ({ id }) => {
  const { userStore } = useContext(UserStoreContext);
  const { userCart, setUserCart } = useContext(UserCartContext);
  const { catalogItem, isLoading, isError } = useCatalogItem(id, userStore.id);
  const [quantity, setItemQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = (itemObj) => {
    itemObj['quantity'] = quantity;
    setAddingToCart(true);
    setAddedToCart(false);
    fetch(`/api/cart`, {
      method: 'POST',
      body: JSON.stringify({
        siteId: userStore.id,
        cart: userCart,
        etag: userCart.etag ?? false,
        location: userCart.location ?? false,
        item: itemObj,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        userCart.location = data.location;
        userCart.etag = data.etag;
        userCart.totalQuantity = userCart.totalQuantity
          ? userCart.totalQuantity + quantity
          : quantity;
        setUserCart(userCart);
        setAddedToCart(true);
        setAddingToCart(false);
      });
  };

  const handleQuantityChange = (event) => {
    const qty = parseInt(event.target.value);
    setItemQuantity(qty);
  };

  return (
    <div className="d-flex flex-column main-container">
      <Header />
      <Container className="my-4 flex-grow-1">
        {isLoading && (
          <div className="d-flex justify-content-center h-100">
            <Spinner color="dark" />
          </div>
        )}
        {!isLoading && !isError && (
          <Breadcrumb className="bg-white shadow-sm">
            {catalogItem['categories'].map((ancestor) => (
              <BreadcrumbItem key={ancestor.nodeCode}>
                <Link href={`/category/${ancestor.nodeCode}`}>
                  {ancestor.title.value}
                </Link>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
        {isError && <p className="text-muted">Uhoh, we've hit an error.</p>}
        {!isLoading && !isError && (
          <Card className="mb-3 border-0 shadow-sm">
            <Row className="no-gutters">
              <Col sm="4">
                <Image
                  src={
                    catalogItem.itemAttributes &&
                    catalogItem.itemAttributes.imageUrls.length > 0
                      ? catalogItem.itemAttributes.imageUrls[0]
                      : 'https://via.placeholder.com/500'
                  }
                  layout="responsive"
                  width={500}
                  height={500}
                  alt={catalogItem.item.shortDescription.values[0].value}
                  className="p-4"
                />
              </Col>
              <Col sm="8">
                <CardBody className="h-100 d-flex flex-column pb-5">
                  <CardTitle tag="h2" className="bd-highlight">
                    {catalogItem.item.shortDescription.values[0].value}
                  </CardTitle>
                  <CardSubtitle className="mb-2 text-muted">
                    <strong>Item #:</strong> {catalogItem.item.itemId.itemCode}
                  </CardSubtitle>
                  <CardText>
                    {catalogItem.item.longDescription.values[0].value}
                  </CardText>
                  <div className="mt-auto p-2">
                    <div className="d-flex justify-content-between mb-3">
                      <div className="flex-fill">
                        <h3 className="text-muted">
                          {catalogItem.itemPrices
                            ? `$${catalogItem.itemPrices[0].price}`
                            : 'Not available at this store'}
                        </h3>
                      </div>
                      <Row className="flex-fill text-right">
                        <Col />
                        <Col sm="4">
                          <FormGroup>
                            <Input
                              type="select"
                              name="select"
                              id="qtySelect"
                              value={quantity}
                              onChange={handleQuantityChange}
                            >
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (item) => (
                                  <option key={item}>{item}</option>
                                )
                              )}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <Button
                            block
                            color="primary"
                            onClick={() => handleAddToCart(catalogItem.item)}
                            className={`${addedToCart && 'fade-btn'}`}
                            color={addedToCart ? 'success' : 'primary'}
                            outline
                            onAnimationEnd={() => setAddedToCart(false)}
                          >
                            {addingToCart && <Spinner size="sm" />}
                            {addedToCart ? (
                              <div>
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  size="lg"
                                />
                                {'  '}Added
                              </div>
                            ) : (
                              'Add to Cart'
                            )}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardBody>
              </Col>
            </Row>
          </Card>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      id: context.params.id,
    },
  };
}

export default CatalogItem;
