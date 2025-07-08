import { Button, Input, InputNumber, Modal, notification, Select, Space } from "antd";
import { useState } from "react";
import { createBookAPI, handleUploadFile } from "../../services/api.service";


const CreateBookController = (props) => {

    const [mainText, setMainText] = useState("")
    const [author, setAuthor] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [category, setCategory] = useState("")

    const { loadBook, dataBooks, isCreateOpen, setIsCreateOpen } = props

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)


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
    const handleCreateBook = async () => {
        if (!selectedFile) {
            notification.error({
                message: 'Error create book',
                description: "Vui lòng upload ảnh thumbnail",
            })
            return;
        }
        // step1: upload file 
        const resUpload = await handleUploadFile(selectedFile, "book");
        if (resUpload.data) {
            //success
            const newThumbnail = resUpload.data.fileUploaded;
            //step 2: create book
            const resUpdateAvatar = await createBookAPI(newThumbnail, mainText, author, price, quantity, category)

            if (resUpdateAvatar.data) {
                resetAndCloseModel()
                await loadBook();
                notification.success({
                    message: "Create Boook",
                    description: "Create book thành công!"
                })
            } else {
                //failed
                notification.error({
                    message: "Error Update File",
                    description: JSON.stringify(resUpdateAvatar.message)
                })
            }

        } else {
            //failed
            notification.error({
                message: "Error Upload File",
                description: JSON.stringify(resUpload.message)
            })
        }

    }

    const resetAndCloseModel = () => {
        setIsCreateOpen(false);
        setMainText("");
        setAuthor("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setSelectedFile(null);
        setPreview(null);

    }
    return (
        <>
            <Button type="primary" onClick={() => { setIsCreateOpen(true) }}>Create Book</Button>
            <Modal
                title="Create Book"
                open={isCreateOpen}
                onOk={() => { handleCreateBook() }}
                onCancel={() => resetAndCloseModel()}
                maskClosable={false}
                okText={"CREATE"}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: "15px" }}>
                    <div>
                        <span>Tiêu đề</span>
                        <Input
                            value={mainText}
                            onChange={(event) => setMainText(event.target.value)}
                        />
                    </div>
                    <div>
                        <span>Tác giả</span>
                        <Input
                            value={author}
                            onChange={(event) => setAuthor(event.target.value)}
                        />
                    </div>
                    <div>
                        <span>Giá tiền</span>
                        <InputNumber
                            value={price}
                            addonAfter={' đ'}
                            style={{ width: "100%" }}
                            onChange={(event) => setPrice(event)} />
                    </div>
                    <div>
                        <span>Số lượng</span>
                        <InputNumber
                            value={quantity}
                            style={{ width: 470 }}
                            onChange={(event) => setQuantity(event)}
                        />
                    </div>
                    <div>
                        <span>Thể loại: </span>
                        <Select
                            value={category}
                            defaultValue="Arts"
                            style={{ width: "100%" }}
                            onChange={(event) => { setCategory(event) }}
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
                            ]}
                        />
                    </div>
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
                            // onChange={() => { handleOnChangeFile() }} 
                            onChange={(event) => handleOnChangeFile(event)}
                            onClick={(event) => {
                                event.target.value = null
                            }}
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
                </div>
            </Modal>
        </>
    )

}

export default CreateBookController