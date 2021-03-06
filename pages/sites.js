import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import Header from '~/components/public/Header';
import { geolocated } from 'react-geolocated';
import { Col, Container, Row } from 'reactstrap';
import Footer from '~/components/public/Footer';
import { UserStoreContext } from '~/context/userStore';
import FindStoreMap from '~/components/public/FindStoreMap';
import FindStoreModalStore from '~/components/public/FindStoreModalStore';

const Sites = (props) => {
  const { coords } = props;
  const { setUserStore } = useContext(UserStoreContext);
  const [coordinates, setCoordinates] = useState(coords);
  const [sites, setSites] = useState();
  if (props.coords && !coordinates) {
    setCoordinates(props.coords);
  }

  useEffect(async () => {
    // Get locations near user.
    const fetchData = async () => {
      if (props.coords && coordinates.latitude) {
        fetch(
          `/api/findSites?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            setSites(data.data.sites);
          });
      } else {
        fetch(`/api/findSites`)
          .then((res) => res.json())
          .then((data) => {
            setSites(data.data.pageContent);
          });
      }
    };
    fetchData();
  }, [coordinates]);

  return (
    <div className="d-flex flex-column main-container">
      <Header />
      <Container className="my-4 flex-grow-1">
        <h1>Stores</h1>
        <Row>
          <Col md="6">
            <FindStoreMap
              sites={sites}
              coordinates={coords}
              setUserStore={setUserStore}
            />
          </Col>
          <Col md="6">
            <ul>
              {sites &&
                sites.length > 0 &&
                sites.map((site) => (
                  <FindStoreModalStore
                    site={site}
                    setUserStore={setUserStore}
                    key={site.id}
                  />
                ))}
            </ul>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Sites);
