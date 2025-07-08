import { Button, Col, Form, Input, InputNumber, Modal, notification, Row, Select } from "antd";
import { useState } from "react";
import { createBookAPI, handleUploadFile } from "../../services/api.service";

const CreateBookUncontrol = (props) => {

    const { loadBook, isCreateOpen, setIsCreateOpen } = props

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

    const handleSubmitBtn = async (values) => {
        if (!selectedFile) {
            notification.error({
                message: 'Error create book',
                description: "Vui lòng upload ảnh thumbnail",
            })
            return;
        }
        setLoading(true)
        const resUpload = await handleUploadFile(selectedFile, "book");
        if (resUpload.data) {
            //success
            const newThumbnail = resUpload.data.fileUploaded;
            const { mainText, author, price, quantity, category } = values;
            const resBook = await createBookAPI(
                newThumbnail, mainText, author, price, quantity, category
            );

            await new Promise(resolve => setTimeout(resolve, 2000));
            if (resBook.data) {
                resetAndCloseModel()
                await loadBook();
                notification.success({
                    message: 'Create Book',
                    description: 'Tạo Book mới thành công',
                })
            } else {
                notification.error({
                    message: 'Error Create Book',
                    description: JSON.stringify(resBook.message),
                })
            }
        }
        setLoading(false)
    }


    const resetAndCloseModel = () => {
        form.resetFields();
        setIsCreateOpen(false);
        setSelectedFile(null);
        setPreview(null);

    }
    return (
        <>
            <Button type="primary" onClick={() => { setIsCreateOpen(true) }}>Create Book</Button>

            <Modal
                open={isCreateOpen}
                onOk={() => {
                    form.submit()
                }}
                onCancel={() => { resetAndCloseModel() }}
                maskClosable={false}
                okText={"CREATE"}
                footer={[
                    <Button key="cancel" onClick={() => { resetAndCloseModel() }}>Cancel</Button>,
                    <Button key="submit"
                        loading={loading}
                        type="primary"
                        onClick={() => { form.submit() }}>CREATE</Button>

                ]}
            >

                <Form
                    layout='vertical'
                    form={form}
                    onFinish={handleSubmitBtn}
                >

                    <h2 style={{ textAlign: "center" }}>Create Book</h2>
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
                                    Upload Book
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

export default CreateBookUncontrol