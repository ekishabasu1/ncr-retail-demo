import { useState, useEffect } from 'react';
import Header from './Header';
import { Formik, Form, Field, ErrorMessage } from "formik";
import CategorySelect from './CategorySelect';
import * as Yup from "yup";
import useCategory from '../../context/useCategory';
import { Alert, Row, Col, Spinner } from 'reactstrap';

const init = {
  title: '',
  nodeCode: '',
  tag: '',
  departmentNode: false,
  departmentSale: false,
  status: '',
  parentCategory: '',
  version: 1
}

const createCategorySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  nodeCode: Yup.string().required('Node code is required'),
  tag: Yup.string(),
  departmentNode: Yup.boolean(),
  departmentSale: Yup.boolean(),
  status: Yup.mixed().required().oneOf(["INACTIVE", "ACTIVE", "DISCONTINUED", "SEASONAL", "TO_DISCONTINUE", "UNAUTHORIZED"]),
  parentCategory: Yup.string(), //todo this validation
  version: Yup.number().required()
})

const CategoryForm = ({ id, categoryNodes }) => {

  const [showAlert, setShowAlert] = useState(false);
  const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);
  let { category, isLoading, isError } = useCategory(id);
  const [initialValues, setInitialValues] = useState(init);
  if (id && !isLoading && !isError && initialValues.nodeCode == '') {
    const { data } = category;
    console.log('data', data);
    const { departmentNode, departmentSale, nodeCode, status, tag, version, title, nodeId, parentId } = data;
    let categoryValues = {
      version: version + 1,
      tag,
      nodeCode,
      tag: tag ?? '',
      departmentNode: departmentNode ?? false,
      departmentSale: departmentSale ?? false,
      status,
      title: title.values[0].value, // this should beupdated for locales?
      parentCategory: parentId ? parentId.nodeId : ''
    }
    setInitialValues(categoryValues);
  }
  const [parentCategory, setParentCategory] = useState();

  const handleSubmit = async values => {
    console.log('values');
    if (values['parentCategory'] == '' && parentCategory) {
      values["parentCategory"] = parentCategory;
    }

    console.log('values', values);
    let data = {};
    for (const key in values) {
      // Remove empty fields.
      if (values[key] !== "") {
        data[key] = values[key];
      }
      if (key === "version") {
        data['version'] = values[key];
      }
    }
    let title = data['title']
    // Doesn't support multi-lang right now.
    data["title"] = {
      "values": [{
        "locale": 'en-US',
        "value": title
      }]
    }

    if (data['parentCategory']) {
      data['parentId'] = {
        "nodeId": data['parentCategory']
      };
      delete data['parentCategory'];
    }
    data['nodeId'] = {
      'nodeId': data['nodeCode']
    };
    let nodes = { "nodes": [data] }
    if (id) {
      fetch(`/api/category/${id}`, { method: "PUT", body: JSON.stringify(nodes) })
        .then(response => response.json())
        .then(data => {
          if (data.status != 204) {
            setShowAlert({ status: data.status, message: data.data.message })
          } else {
            setShowAlert({ status: 200, message: 'Category successfully updated.' })
          }
          setVisible(true);
        })
    } else {
      fetch(`/api/category`, { method: "PUT", body: JSON.stringify(nodes) })
        .then(response => response.json())
        .then(data => {
          if (data.status != 204) {
            setShowAlert({ status: data.status, message: data.data.message })
          } else {
            setShowAlert({ status: 200, message: 'Category successfully updated.' })
          }
          setVisible(true);
        })
    }
  }

  return (
    <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={createCategorySchema} onSubmit={handleSubmit}>
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik;
        console.log(errors);
        return (
          <div className="bg pb-4">
            <Header />
            <main className="container">
              <Form>
                {isLoading && (<div className="mt-4 d-flex justify-content-center"><Spinner color="primary" /></div>)}
                <Alert toggle={onDismiss} isOpen={visible} className="mt-4" color={showAlert.status == 200 ? 'success' : 'danger'}>{showAlert.message}</Alert>
                <Row className="mt-4">
                  <Col>
                    <h4 className="mb-1">{id ? 'Edit' : 'Create'} Category</h4>
                  </Col>
                  <Col>
                    <div className="form-group float-right">
                      <button type="submit" className={`${!(dirty && isValid) ? "disabled" : ""} btn btn-primary`} disabled={`${!(dirty && isValid) ? "disabled" : ""}`}> {id ? '+ Update' : '+ Create'} Category</button>
                    </div>
                  </Col>
                </Row>
                <div className="row">
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-body">
                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label htmlFor="title">Title*</label>
                            <Field name="title" id="title" className={`${errors.title && touched.title ? "is-invalid" : null} form-control`} />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label htmlFor="nodeCode">Node Code</label>
                            <Field name="nodeCode" id="nodeCode" className={`${errors.nodeCode && touched.nodeCode ? "is-invalid" : null} form-control`} />
                            <ErrorMessage
                              name="nodeCode"
                              component="div"
                              className="invalid-feedback"
                            />
                            <small id="nodeCode" className="form-text text-muted">
                              This will be the same as the Node Id
                        </small>
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="tag">Tag</label>
                            <Field name="tag" id="tag" className={`${errors.tag && touched.tag ? "is-invalid" : null} form-control`} />
                            <ErrorMessage
                              name="tag"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group form-check">
                              <Field type="checkbox" name="departmentNode" id="departmentNode" className={`${errors.departmentNode && touched.departmentNode ? "is-invalid" : null} form-check-input`} />
                              <ErrorMessage
                                name="departmentNode"
                                component="div"
                                className="invalid-feedback"
                              />
                              <label className="form-check-label" htmlFor="departmentNode">
                                Department Node
                          </label>
                              <small id="departmentNode" className="form-text text-muted">
                                Indicates if this node represents a department
                          </small>
                            </div>

                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <div className="form-check">
                                <Field type="checkbox" name="departmentSale" id="departmentSale" className={`${errors.departmentSale && touched.departmentSale ? "is-invalid" : null} form-check-input`} />
                                <ErrorMessage
                                  name="departmentNode"
                                  component="div"
                                  className="invalid-feedback"
                                />
                                <label className="form-check-label" htmlFor="departmentSale">
                                  Department Sale
                            </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label htmlFor="version">Version</label>
                            <Field name="version" id="version" className={`${errors.version && touched.version ? "is-invalid" : null} form-control`} />
                            <ErrorMessage
                              name="version"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="status" className="h5">Status</label>
                          <Field as="select" name="status" className={`${errors.status && touched.status ? "is-invalid" : null} form-control`}>
                            <option value="" label="--" />
                            <option value="ACTIVE" label="ACTIVE" />
                            <option value="INACTIVE" label="INACTIVE" />
                            <option value="DISCONTINUED" label="DISCONTINUED" />
                            <option value="SEASONAL" label="SEASONAL" />
                            <option value="TO_DISCONTINUE" label="TO_DISCONTINUE" />
                            <option value="UNAUTHORIZED" label="UNAUTHORIZED" />
                          </Field>
                          <ErrorMessage
                            name="status"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <CategorySelect currentCategory={initialValues.nodeCode} initialCategory={initialValues.parentCategory ?? ''} setDisabled={initialValues.parentCategory ? true : false} setParentCategory={setParentCategory} categories={categoryNodes} />
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </main>
          </div >
        )
      }}
    </Formik >
  )
}

export default CategoryForm;