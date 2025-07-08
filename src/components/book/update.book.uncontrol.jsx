import { Button, Col, Form, Input, InputNumber, Modal, notification, Row, Select } from "antd"
import { useEffect, useState } from "react"
import { handleUploadFile, updateBookAPI } from "../../services/api.service"

const UpdateBookUncontrol = (props) => {

    const { loadBook, isUpdateOpen, setIsUpdateOpen, dataUpdate, setDataUpdate } = props

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const [loading, setLoading] = useState(false);

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null)
            setPreview(null)
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreview(URL.createObjectURL(file))
        }
        console.log(">>check file: ", preview);

    }
    const [form] = Form.useForm();

    const resetAndCloseModel = () => {
        form.resetFields();
        setIsUpdateOpen(false);
        setDataUpdate(null);
        setSelectedFile(null);
        setPreview(null);

    }
    useEffect(() => {
        if (dataUpdate && dataUpdate._id) {
            form.setFieldsValue({
                id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                quantity: dataUpdate.quantity,
                category: dataUpdate.category
            })
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`)
        }
    }, [dataUpdate])

    const updateBook = async (newThumbnail, values) => {
        const { id, mainText, author, price, quantity, category } = values;
        const resBook = await updateBookAPI(id, newThumbnail, mainText, author, price, quantity, category);
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (resBook.data) {
            resetAndCloseModel()
            await loadBook();
            notification.success({
                message: "Update Book",
                description: "Cật nhật Book thành công"
            })
        } else {
            notification.error({
                message: "Update Book",
                description: JSON.stringify(resBook.message)
            })
        }
        setLoading(false)
    }

    const handSubmitBtn = async (values) => {
        //không có ảnh preview + k có file => return
        if (!selectedFile && !preview) {
            notification.error({
                message: "Error update book",
                description: "Vui lòng upload ảnh thumbnail"
            })
            return;
        }

        let newThumbnail = "";
        //có ảnh preview và k có file => k upload file
        if (!selectedFile && preview) {
            //do nothing
            newThumbnail = dataUpdate.thumbnail
        } else {
            //có ảnh preview và có file => upload file
            const resUpLoad = await handleUploadFile(selectedFile, "book");
            if (resUpLoad.data) {
                //success
                newThumbnail = resUpLoad.data.fileUploaded;
            } else {
                //failed
                notification.error({
                    message: "Error upload file",
                    description: JSON.stringify(resUpLoad.message)
                });
                return;
            }
        }
        // step 2 : update book
        await updateBook(newThumbnail, values);
    }

    return (
        <>
            <Modal
                open={isUpdateOpen}
                onOk={() => form.submit()}
                onCancel={() => resetAndCloseModel()}
                maskClosable={false}
                okText={"Update"}
                footer={[
                    <Button key="cancel" onClick={() => { resetAndCloseModel() }}>Cancel</Button>,
                    <Button key="submit"
                        loading={loading}
                        type="primary"
                        onClick={() => { form.submit() }}>Update</Button>

                ]}
            >
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={handSubmitBtn}
                >

                    <h2 style={{ textAlign: "center" }}>Update a Book</h2>
                    <Row justify={"center"}>
                        <Col xs={24} md={8} xl={24}>
                            <Form.Item
                                label="id"
                                name="id"
                                rules={[{ required: true, message: 'Tiêu đề không được để trống!' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify={"center"}>
                        <Col xs={24} md={8} xl={24}>
                            <Form.Item
                                label="Tiêu đề"
                                name="mainText"
                                rules={[{ required: true, message: 'Tiêu đề không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={24} md={8} xl={24}>
                            <Form.Item
                                label="Tác giả"
                                name="author"
                                rules={[
                                    { required: true, message: 'Tác giả không được để trống!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={24} md={8} xl={24}>
                            <Form.Item
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Giá tiền không được để trống!',
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} addonAfter={' '} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={24} md={8} xl={24}>
                            <Form.Item
                                label="Số lượng"
                                name="quantity"
                                rules={[{
                                    required: true,
                                    message: "Số lượng không được để trống!"
                                },]}
                            >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={24} md={8} xl={24}>
                            <Form.Item
                                label="Thể loại"
                                name="category" >
                                <Select
                                    style={{ width: "100%" }}
                                    name="category"
                                    options={[
                                        { value: 'Arts', label: 'Arts' },
                                        { value: 'Business', label: 'Business' },
                                        { value: 'Comics', label: 'Comics' },
                                        { value: 'Cooking', label: 'Cooking' },
                                        { value: 'Entertainment', label: 'Entertainment' },
                                        { value: 'History', label: 'History' },
                                        { value: 'Music', label: 'Music' },
                                        { value: 'Sports', label: 'Sports' },
                                        { value: 'Teen', label: 'Teen' },
                                        { value: 'Travel', label: 'Travel' },
                                    ]}>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={24} md={8} xl={24}>
                            <div>
                                <span>Ảnh Thumbnail</span>
                                <label htmlFor="btnUpload" style={{
                                    display: "block",
                                    width: "fit-content",
                                    marginTop: "15px",
                                    padding: "5px 10px",
                                    background: "orange",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}>
                                    Upload
                                </label>
                                <input
                                    type="file" hidden id='btnUpload'
                                    onChange={(event) => handleOnChangeFile(event)}
                                    onClick={(event) => {
                                        event.target.value = null
                                    }}
                                    style={{ display: "none" }}
                                />
                                {preview &&
                                    <>
                                        <div style={{
                                            marginTop: "10px",
                                            marginBottom: "15px",
                                            height: "100px", width: "150px",
                                        }}>
                                            <img style={{ height: "100%", width: "100%", objectFit: "contain" }}
                                                src={preview} />
                                        </div>
                                    </>
                                }
                            </div>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </>
    )
}

export default UpdateBookUncontrol