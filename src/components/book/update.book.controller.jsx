import { Input, InputNumber, Modal, notification, Select } from "antd"
import { useEffect, useState } from "react"
import { handleUploadFile, updateBookAPI } from "../../services/api.service";

const UpdateBookController = (props) => {

    const { loadBook, isUpdateOpen, setIsUpdateOpen, dataUpdate, setDataUpdate } = props

    const [id, setId] = useState("");
    const [mainText, setMainText] = useState("")
    const [author, setAuthor] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [category, setCategory] = useState("")

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)

    //next dataUpdate != prev dataUpdate
    useEffect(() => {
        if (dataUpdate && dataUpdate._id) {
            setId(dataUpdate._id);
            setMainText(dataUpdate.mainText);
            setAuthor(dataUpdate.author);
            setPrice(dataUpdate.price);
            setQuantity(dataUpdate.quantity);
            setCategory(dataUpdate.category);
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`)
        }
    }, [dataUpdate])

    const updateBook = async (newThumbnail) => {
        const resBook = await updateBookAPI(id, newThumbnail, mainText, author, price, quantity, category);
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
    }

    const handSubmitBtn = async () => {
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
        await updateBook(newThumbnail)
    }

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

    const resetAndCloseModel = () => {
        setMainText("");
        setAuthor("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setSelectedFile(null);
        setPreview(null);
        setId("");
        setDataUpdate(null);
        setIsUpdateOpen(false);
    }

    return (
        <>
            <Modal
                title="Update a Book"
                open={isUpdateOpen}
                onOk={() => handSubmitBtn()}
                onCancel={() => resetAndCloseModel()}
                maskClosable={false}
                okText={"Update"}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: "15px" }}>
                    <div>
                        <span>Id</span>
                        <Input
                            value={id}
                            disabled
                        />
                    </div>
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
                        <div>
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
                                onClick={(event) => { event.target.value = null }}
                            />
                        </div>
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

export default UpdateBookController